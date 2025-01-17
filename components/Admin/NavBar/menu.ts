// Libs
import {ReactNode} from "react";
// Icons
import FileCopyOutlined from "@mui/icons-material/FileCopyOutlined";
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';
import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LayersIconOutlined from '@mui/icons-material/LayersOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
// Utils
import {ADMIN_PATH, ADMIN_MAIN} from "@/utils/routers/admin";
import {ROLE_SLUGS} from "@/app-redux/roles/model";

export interface Item {
    href: string;
    icon?: any;
    info?: ReactNode;
    items?: Item[];
    title: string;
    showFor?: string[];
}

export const ADMIN_MENU: Item[] = [
    {
        title: 'Dashboard',
        icon: HomeOutlinedIcon,
        href: ADMIN_MAIN
    },
    {
        title: 'Users',
        icon: PeopleAltOutlinedIcon,
        href: ADMIN_PATH.USERS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN, ROLE_SLUGS.DISPATCH_MANAGER],
    },
    {
        title: 'Workshops',
        icon: StoreMallDirectoryOutlinedIcon,
        href: ADMIN_PATH.WORKSHOPS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN, ROLE_SLUGS.WORKSHOP_MANAGER],
    },
    {
        title: 'Services',
        icon: LanOutlinedIcon,
        href: ADMIN_PATH.SERVICES,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Vehicles',
        icon: TimeToLeaveOutlinedIcon,
        href: ADMIN_PATH.VEHICLES,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Vehicle types',
        icon: ViewCarouselOutlinedIcon,
        href: ADMIN_PATH.VEHICLE_TYPES,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Vehicle brands',
        icon: FactoryOutlinedIcon,
        href: ADMIN_PATH.BRANDS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Orders',
        icon: ReceiptLongOutlinedIcon,
        href: ADMIN_PATH.ORDERS,
    },
    {
        title: 'Reviews',
        icon: MessageOutlinedIcon,
        href: ADMIN_PATH.REVIEWS,
    },
    {
        title: 'City zones',
        icon: LayersIconOutlined,
        href: ADMIN_PATH.CITY_ZONES,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Static Pages',
        icon: FileCopyOutlined,
        href: ADMIN_PATH.STATIC_PAGES,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Contact Us',
        icon: ContactSupportOutlinedIcon,
        href: ADMIN_PATH.CONTACT_US,
        showFor: [ROLE_SLUGS.SUPER_ADMIN, ROLE_SLUGS.DISPATCH_MANAGER],
    },
    {
        title: 'Reports',
        icon: AssessmentOutlinedIcon,
        items: [
            {
                title: 'Cleaner Reports',
                href: ADMIN_PATH.CLEANER_REPORTS,
            },
            {
                title: 'Service Reports',
                href: ADMIN_PATH.SERVICE_REPORTS,
            }
        ],
        href: "",
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: "Payouts",
        icon: PaidOutlinedIcon,
        href: ADMIN_PATH.PAYOUTS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: "Withdrawals",
        icon: AccountBalanceOutlined,
        href: ADMIN_PATH.WITHDRAWALS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
    {
        title: 'Settings',
        icon: SettingsOutlinedIcon,
        href: ADMIN_PATH.SETTINGS,
        showFor: [ROLE_SLUGS.SUPER_ADMIN],
    },
];
