import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 w-full p-10 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
