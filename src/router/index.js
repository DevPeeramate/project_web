import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from "@/components/HomeComponent.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";
import ReviewComponent from '@/components/ReviewComponent.vue';
import RoomComponent from '@/components/RoomComponent.vue';
import AdminComponent from '@/components/AdminComponent.vue';
import ManageRoom from "../components/ManageRoom.vue"
import AddRoom from "../components/AddRoom.vue"
import EditRoom from "../components/EditRoom.vue"
import PageMember from "../components/PageMember.vue"
import MyRoom from "../components/MyRoom.vue"
import RoomDetail from "../components/RoomDetail.vue"
import ManageReview from "../components/ManageReview.vue"
import AdminHome from "../components/AdminHome.vue"

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeComponent
    },
    {
        path: '/ManageReview',
        name: 'ManageReview',
        component: ManageReview
    },

    {
        path: '/login',
        name: 'login',
        component: LoginComponent
    },

    {
        path: '/register',
        name: 'register',
        component: RegisterComponent
    },

    {
        path: '/review',
        name: 'review',
        component: ReviewComponent
    },
    
    {
        path: '/room',
        name: 'room',
        component: RoomComponent
    },

    {
        path: '/admin',
        name: 'admin',
        component: AdminComponent
    },
    {
        path: "/ManageRoom",
        name: "ManageRoom",
        component:ManageRoom
    },
    {
        path: "/AddRoom",
        name: "AddRoom",
        component:AddRoom
    },
    {
        path: "/EditRoom/:dataTest",
        name: "EditRoom",
        component:EditRoom,
        // props: true
        // props: (route) => ({ roomId: route.params.roomId.toString() })

    },{
        path: "/pageMember",
        name: "PageMember",
        component:PageMember
        // props: true
        // props: (route) => ({ roomId: route.params.roomId.toString() })

    },
    {
        path: "/myroom",
        name: "myroom",
        component:MyRoom
        // props: true
        // props: (route) => ({ roomId: route.params.roomId.toString() })

    },
    {
        path: "/roomdetail/:roomId",
        name: "roomdetail",
        component:RoomDetail,
        // props: true
        // props: (route) => ({ roomId: route.params.roomId.toString() })

    },

    {
        path: "/adminhome",
        name: "adminhome",
        component:AdminHome,
        // props: true
        // props: (route) => ({ roomId: route.params.roomId.toString() })

    },

];
  
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
export default router