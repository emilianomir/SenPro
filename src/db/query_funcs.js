import db from "./index";
export async function getAllUsers() {
  const getAll = db.prepare("SELECT email FROM users;"); // same as .get for Nodejs
  return getAll.all();
}

export async function addUser(email, password) {
  const addSome = db.prepare(
    "INSERT INTO users (email, password) VALUES (?, ?);"
  );
  addSome.run(email, password); // no data returned
}
