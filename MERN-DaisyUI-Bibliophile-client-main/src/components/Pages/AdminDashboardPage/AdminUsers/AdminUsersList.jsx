import clsx from "clsx"
import DetailsButton from "../../../Shared/Buttons/DetailsButton"

function AdminUsersList({ users, onUserClick, loadedImages, handleImageLoad }) {
  return (
    <ul className="list bg-base-100 rounded-box border-base-300/50 border-1 shadow-md">
      {users.map((user) => (
        <li className="list-row items-center" key={user._id}>
          <div className="relative">
            {!loadedImages[user._id] && <div className="skeleton absolute size-10"></div>}
            <img
              className={clsx("rounded-box size-10", !loadedImages[user._id] && "invisible")}
              src={user.profileImage || "/assets/moonProfile.webp"}
              alt={user.userName}
              onLoad={() => handleImageLoad(user._id)}
            />
          </div>
          <div>
            <div className="font-semibold">{user.userName}</div>
            <div className="line-clamp-1 text-xs font-semibold opacity-60">{user.email}</div>
          </div>
          <div className="badge badge-outline w-16">{user.role}</div>
          <DetailsButton
            onClick={(e) => {
              e.stopPropagation()
              onUserClick(user)
            }}
            ariaLabel="View user details"
          />
        </li>
      ))}
    </ul>
  )
}

export default AdminUsersList
