import useAuth from "./useAuth";

export default function useGroup() {
  const { setSelectedGroup } = useAuth();
  const updateGroup = (group) => {
    const admins = group.groupAdmin;
    const owner = group.groupOwner;
    const usersListWithRole = group.users.map((user) => {
      if (admins.some((e) => e._id === user._id)) {
        if (owner._id === user._id)
          return {
            ...user,
            role: "owner",
          };
        return {
          ...user,
          role: "admin",
        };
      }
      return {
        ...user,
        role: "member",
      };
    });
    setSelectedGroup({
      ...group,
      users: usersListWithRole,
    });
  };
  return updateGroup;
}
