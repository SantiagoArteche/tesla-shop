import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin",
  description: "Admin section",
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
