import { useGeneralContext } from "../../context/GeneralContext.js";

export default function AllUsers() {
  const { users } = useGeneralContext();

  return (
    <section className="page panel">
      <div className="section-heading">
        <h2>All Users</h2>
        <span>{users.length} users</span>
      </div>
      <div className="users-table">
        {users.map((user) => (
          <article className="user-row" key={user._id}>
            <div>
              <strong>{user.username}</strong>
              <p>{user.email}</p>
            </div>
            <span>{user.usertype}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
