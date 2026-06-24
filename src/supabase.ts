import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import type { Registration } from './types';

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
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('seat_number');

    if (error) throw error;
    return (data ?? []).map((r: { seat_number: string }) => r.seat_number);
  } catch (err) {
    console.error('Failed to fetch booked seats:', err);
    throw new Error('Could not load seat availability. Please refresh the page.');
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
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('seat_number', seatNumber)
      .maybeSingle();

    if (error) throw error;
    return !data;
  } catch (err) {
    console.error('Failed to check seat availability:', err);
    throw new Error('Could not verify seat availability. Please try again.');
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
