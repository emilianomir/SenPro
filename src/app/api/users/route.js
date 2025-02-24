import { insertUser } from "@/db/queries";

export async function POST(req) {
  try {
    const { name, age, email } = await req.json();
    await insertUser(name, age, email);
  } catch (e) {
    console.log(e);
  }
}
