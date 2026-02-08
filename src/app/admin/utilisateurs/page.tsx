import { getUsers } from "@/app/actions/users";
import { UserList } from "@/components/dashboard/user-list";

export default async function AdminUsersPage() {
    const usersResult = await getUsers();
    const users = usersResult.success ? usersResult.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen">
            <UserList initialUsers={users || []} />
        </div>
    );
}
