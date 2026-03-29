export const parseName = (fullName) => {
  const parts = fullName.trim().split(" ");

  let primary_name = "";
  let secondary_name = "";
  let first_surname = "";
  let second_surname = "";

  if (parts.length === 1) {
    primary_name = parts[0];
  } else if (parts.length === 2) {
    primary_name = parts[0];
    first_surname = parts[1];
  } else if (parts.length === 3) {
    primary_name = parts[0];
    first_surname = parts[1];
    second_surname = parts[2];
  } else if (parts.length >= 4) {
    primary_name = parts[0];
    secondary_name = parts[1];
    first_surname = parts[2];
    second_surname = parts[3];
  }

  return { primary_name, secondary_name, first_surname, second_surname };
};
