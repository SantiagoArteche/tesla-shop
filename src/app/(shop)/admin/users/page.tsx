import { getUsersPaginated } from "@/actions/users/get-users-paginated";
import { Pagination, Title } from "@/components";
import { UsersTable } from "./ui/UsersTable";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}
export default async function AdminUsersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { users = [], ok, totalPages = 1 } = await getUsersPaginated({ page });

  if (!ok) redirect("/auth/login");

  if (users.length === 0) {
    redirect("/");
  }
  return (
    <div>
      <Title title="Users" />
      <div className="mb-10">
        <UsersTable users={users} />
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
