// these trigger when fetched, depending ont he type
import { getAllUsers, addUser } from "@/db/query_funcs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json(
        { error: "you need to priovide email and password" }, // frontend will receive this error message
        { status: 400 }
      );
    }

    const users = await getAllUsers();
    if (users.find((user) => user.email === email)) {
      return Response.json(
        { error: "theres that email in db already" },
        { status: 400 }
      ); // get out, return response to frontend
    }

    await addUser(email, password); // call the func to add user, already not in db
    console.log("added user");
    return Response.json({ message: "added a user" });
  } catch (e) {
    return Response.json({ e: "couldnt send to frontend" }, { status: 400 });
  }
}
