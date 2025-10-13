import {currentUser} from "@clerk/nextjs/server";

const DashBoardPage = async  () => {
    const user = await currentUser()

    return <div className={"p-4"}>
        <div>
            <h1 className={"text-xl font-bold"}>Welcome to the Dashboard, {user ? user.firstName : "Guest"}</h1>
        </div>
        <div>

        </div>
    </div>;
}

export default DashBoardPage;