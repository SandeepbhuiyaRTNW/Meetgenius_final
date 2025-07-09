// Utility to map profile names to their corresponding image paths
export function getProfileImage(name: string): string {
  const nameToImageMap: Record<string, string> = {
    // Original profiles
    'Bernard Uko': '/images/Bernard_Uko.jpeg',
    'Ben Uko': '/images/Bernard_Uko.jpeg', // Same person, different name format
    'Itti Jindani': '/images/Itti Jindani.jpeg',
    'Glenn Gray': '/images/Glenn Gray.jpeg',
    'Mark Zukor': '/images/Mark Zukor .jpeg',
    'Aditya Prabhu': '/images/Aditya Prabhu.jpeg',
    'Natalia Dueholm': '/images/Natalia Dueholm.jpeg',
    'Himanshu Laiker': '/images/Himanshu Laiker, MBA.jpeg',
    'Himanshu Laiker, MBA': '/images/Himanshu Laiker, MBA.jpeg',
    'Andre Smith': '/images/Andre Smith.jpeg',
    'Mark Hurlburt': '/images/Mark Hurlburt.jpeg',
    'Kenneth Krutsch': '/images/Kenneth Krutsch.jpeg',
    'Steve Stark': '/images/Steve Stark.jpeg',
    'Colin Hirdman': '/images/Colin Hirdman.jpeg',
    'Christi Kmecik': '/images/Christi Kmecik.jpeg',
    'Hayley Brooks': '/images/Hayley Brooks.jpeg',
    'Arthur A Kennedy': '/images/Arthur A Kennedy.jpeg',
    'Michael J.': '/images/Michael J..jpeg',
    'Summer Song': '/images/Summer Song.jpeg',
    'Peter Somerville': '/images/Peter Somerville.jpeg',
    'Nate Donovan': '/images/Nate Donovan.jpeg',
    'Kate Kuehl': '/images/Kate Kuehl.jpeg',
    'Ben Theis': '/images/Ben Theis.jpeg',
    'Taylor Birkeland': '/images/Taylor Birkeland.jpeg',

    // New profiles from updated PDFs
    'Amit Deshpande': '/images/Amit Deshpande.jpeg',
    'Cihan Behlivan': '/images/default-avatar.svg', // No image available
    'Chris Madden': '/images/default-avatar.svg', // No image available
    'Irene O': '/images/Irene O.jpeg',
    'Liban (lee~ben) Kano': '/images/Liban (lee~ben) Kano.jpeg',
    'Michael Hands': '/images/default-avatar.svg', // No image available
    'Natalia': '/images/Natalia Dueholm.jpeg',
    'Toby Madden': '/images/default-avatar.svg', // No image available

    // Edge case - Shailesh Bhor
    'Shailesh Bhor': '/images/Shailesh Bhor.jpeg'
  };

  return nameToImageMap[name] || '/images/default-avatar.svg';
}

// Generate initials for fallback display
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
