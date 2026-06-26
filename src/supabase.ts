import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import type { Registration, Team, TeamMember } from './types';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.',
  );
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
);

export async function getBookedSeats(): Promise<string[]> {
  let regSeats: string[] = [];
  try {
    const { data: regData, error: regError } = await supabase
      .from('registrations')
      .select('seat_number');

    if (regError) throw regError;
    regSeats = (regData ?? []).map((r: { seat_number: string }) => r.seat_number);
  } catch (err) {
    console.error('Failed to fetch registrations seats:', err);
    throw new Error('Could not load seat availability. Please refresh the page.');
  }

  try {
    const { data: memData, error: memError } = await supabase
      .from('team_members')
      .select('seat_number');

    if (memError) throw memError;
    const memSeats = (memData ?? []).map((m: { seat_number: string }) => m.seat_number);
    return [...regSeats, ...memSeats];
  } catch (err) {
    console.warn('Failed to fetch team members seats (table might not exist):', err);
    return regSeats;
  }
}

export async function uploadIdCard(
  file: File,
  email: string,
): Promise<string> {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${ext}`;      const { error: uploadError } = await supabase.storage
        .from('id-cards')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('id-cards')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload ID card:', err);
    throw new Error('Could not upload ID card. Please try again.');
  }
}

export async function checkSeatAvailability(
  seatNumber: string,
): Promise<boolean> {
  try {
    const { data: regData, error: regError } = await supabase
      .from('registrations')
      .select('id')
      .eq('seat_number', seatNumber)
      .maybeSingle();

    if (regError) throw regError;
    if (regData) return false;
  } catch (err) {
    console.error('Failed to check seat availability in registrations:', err);
    throw new Error('Could not verify seat availability. Please try again.');
  }

  try {
    const { data: memData, error: memError } = await supabase
      .from('team_members')
      .select('id')
      .eq('seat_number', seatNumber)
      .maybeSingle();

    if (memError) throw memError;
    return !memData;
  } catch (err) {
    console.warn('Failed to check seat availability in team_members (table might not exist):', err);
    return true;
  }
}

export async function getAllRegistrations(): Promise<Registration[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('Failed to fetch registrations:', err);
    throw new Error('Could not load registrations. Please try again.');
  }
}

export async function submitRegistration(
  registration: Registration,
): Promise<void> {
  try {
    const payload: any = {
      full_name: registration.full_name,
      college_name: registration.college_name,
      email: registration.email,
      phone: registration.phone,
      id_card_url: registration.id_card_url,
      events_selected: registration.events_selected,
      seat_number: registration.seat_number,
    };
    if (registration.hackathon_problem) {
      payload.hackathon_problem = registration.hackathon_problem;
    }
    if (registration.shark_tank_problem) {
      payload.shark_tank_problem = registration.shark_tank_problem;
    }
    const { error } = await supabase.from('registrations').insert([payload]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to submit registration:', err);
    throw new Error('Registration failed. Please try again.');
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete registration:', err);
    throw new Error('Could not delete registration. Please try again.');
  }
}

export async function getAllTeams(): Promise<Team[]> {
  try {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (teamsError) throw teamsError;

    const { data: membersData, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (membersError) throw membersError;

    const teams: Team[] = teamsData ?? [];
    const members: TeamMember[] = membersData ?? [];

    teams.forEach((team) => {
      team.members = members.filter((m) => m.team_id === team.id);
    });

    return teams;
  } catch (err) {
    console.error('Failed to fetch teams:', err);
    return [];
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete team:', err);
    throw new Error('Could not delete team. Please try again.');
  }
}

export async function submitTeamRegistration(
  team: Team,
  members: TeamMember[]
): Promise<void> {
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .insert([{
      team_name: team.team_name,
      leader_name: team.leader_name,
      leader_email: team.leader_email,
      leader_phone: team.leader_phone,
      college_name: team.college_name,
      events_selected: team.events_selected,
      hackathon_problem: team.hackathon_problem,
      shark_tank_problem: team.shark_tank_problem,
    }])
    .select('id')
    .single();

  if (teamError) throw teamError;
  if (!teamData) throw new Error('Failed to create team record.');

  const teamId = teamData.id;

  try {
    const memberPayloads = members.map(m => ({
      team_id: teamId,
      member_name: m.member_name,
      member_email: m.member_email,
      id_card_url: m.id_card_url,
      seat_number: m.seat_number,
    }));

    const { error: membersError } = await supabase
      .from('team_members')
      .insert(memberPayloads);

    if (membersError) throw membersError;
  } catch (insertError) {
    // Rollback: delete team (which cascades to team_members)
    await supabase.from('teams').delete().eq('id', teamId);
    throw insertError;
  }
}
