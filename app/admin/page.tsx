import { getIsAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import App from "./app";

const AdminPage = () => {

    const isAdmin = getIsAdmin()

    if (!isAdmin) {
        redirect("/")
    }
    return (
        <App />
    )
}
export default AdminPage;

