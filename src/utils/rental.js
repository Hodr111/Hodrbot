import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(__dirname, "..", "..", "database");
const rentalFile = path.join(databasePath, "rented-groups.json");

function readRentals() {
  if (!fs.existsSync(rentalFile)) {
    fs.writeFileSync(rentalFile, "{}");
  }

  return JSON.parse(fs.readFileSync(rentalFile, "utf8"));
}

function saveRentals(data) {
  fs.writeFileSync(rentalFile, JSON.stringify(data, null, 2), "utf8");
}

export function setRental(groupId, days) {
  const rentals = readRentals();

  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;

  rentals[groupId] = {
    expiresAt,
    days,
  };

  saveRentals(rentals);

  return rentals[groupId];
}

export function setUnlimited(groupId) {
  const rentals = readRentals();

  rentals[groupId] = {
    unlimited: true,
    expiresAt: null,
    days: null,
  };

  saveRentals(rentals);

  return rentals[groupId];
}

export function isUnlimited(groupId) {
  const rental = getRental(groupId);

  return !!rental?.unlimited;
}

export function removeUnlimited(groupId) {
  const rentals = readRentals();

  if (!rentals[groupId]?.unlimited) {
    return false;
  }

  delete rentals[groupId];
  saveRentals(rentals);

  return true;
}

export function removeRental(groupId) {
  const rentals = readRentals();

  if (!rentals[groupId]) {
    return false;
  }

  delete rentals[groupId];
  saveRentals(rentals);

  return true;
}

export function getRental(groupId) {
  const rentals = readRentals();
  return rentals[groupId] || null;
}

export function isRentalActive(groupId) {
  const rental = getRental(groupId);

  if (!rental) {
    return false;
  }

  if (rental.unlimited) {
    return true;
  }

  return Date.now() < rental.expiresAt;
}

export function getRentalDaysLeft(groupId) {
  const rental = getRental(groupId);

  if (!rental) {
    return 0;
  }

  const remaining = rental.expiresAt - Date.now();

  if (remaining <= 0) {
    return 0;
  }

  return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}

export function getRentalExpiration(groupId) {
  const rental = getRental(groupId);

  if (!rental) {
    return null;
  }

  return new Date(rental.expiresAt);
}
