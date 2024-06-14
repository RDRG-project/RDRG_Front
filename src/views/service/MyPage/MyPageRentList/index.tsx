import { useUserStore } from "src/stores";
import UserRentList from "./UserRentList";
import AdminRentList from "./AdminRentList";
import "./style.css";

//                    component                    //
export default function MypageRentList() {

    //                    state                    //
    const { loginUserRole } = useUserStore();

    //                    render                    //
    return (
        <div id='mp-rent-list-wrapper'>
            {loginUserRole === 'ROLE_USER' ? (
                <UserRentList />
            ) : (
                <AdminRentList />
            )}
        </div>
    );
}
