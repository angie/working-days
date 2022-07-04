import { Form, Link } from "@remix-run/react";

export function NavBar() {
  return (
    <header className="flex items-center justify-between bg-prussian-blue-900 p-4 text-solitaire-50">
      <h1 className="text-xl font-bold sm:text-3xl">
        <Link to="/">working days</Link>
      </h1>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-pink-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
