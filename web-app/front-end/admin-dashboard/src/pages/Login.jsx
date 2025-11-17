export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>

        <form>
          <input className="w-full border p-2 rounded mb-4" type="email" placeholder="Email" />
          <input className="w-full border p-2 rounded mb-4" type="password" placeholder="Mot de passe" />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
            Se connecter
          </button>
        </form>
      </div>

    </div>
  );
}
