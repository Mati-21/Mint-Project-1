import { LuFrame } from "react-icons/lu";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import { FcPlanner } from "react-icons/fc";
import { TbReportAnalytics } from "react-icons/tb";

const Datas = [
  {
    sectionTitle: "Result Framework",
    menu: ["Ministry's Sector-plan"],
    submenu: true,
    key: "menu1",
    icon: <LuFrame size={23} className="text-white" />,
    subMenuItems: [
      {
        subMenuItem: "Innovation and research",
        link: "innovation-research",
        subsubmenu: true,
        subsubMenus: [
          "National Research",
          "Technology Transformation",
          "Technology Innovation & Management",
        ],
      },
      {
        subMenuItem: "ICT and Digital economy",
        // link: "ict",
        subsubmenu: true,
        subsubMenus: [
          "National E-Government Service",
          "ICT Infrastructure & Development Management",
          "Digital Economy Development Sector",
        ],
      },
      {
        subMenuItem: "Affiliated institutions",
        link: "affiliated-institutions",
        subsubmenu: true,
        subsubMenus: [
          "Intellectual Property",
          "Technology Authority",
          "Bio & Emerging Technology",
          "Space Science & Geospatial",
          "ICT Park",
        ],
      },
      {
        subMenuItem: "Minister office",
        // link: "minister-office",
        subsubmenu: true,
        subsubMenus: [
          "Innovation Fund",
          "Policy & StrategyStudies Research",
          "Legal Service",
          "Ethics",
          "Public Relation",
          "Women & Social Aairs",
          "Audit Service",
          "Reform",
          "Partnership & Collaboration",
        ],
      },
      {
        subMenuItem: "Admin issues",
        // link: "admin-issue",
        subsubmenu: true,
        subsubMenus: [
          "Strategic Affairs",
          "ICT",
          "Procurement & Finance",
          "General Services",
          "Human Resources",
        ],
      },
    ],
  },

  {
    sectionTitle: "Annual/Quarterly",
    menu: ["Planning"],
    icon: <FcPlanner size={23} className="text-white" />,
  },
  {
    menu: ["Performance"],
  },

  {
    sectionTitle: "Data Managment",
    menu: ["Performance Alert"],
    icon: <MdOutlineDisplaySettings size={23} className="text-white" />,
  },

  { menu: ["Above Treshhold Performance"] },
  { menu: ["Below Treshhold Performance"] },

  {
    sectionTitle: "Data Analysis",
    menu: ["Sectorial Illustration"],
    icon: <IoAnalytics size={23} className="text-white" />,
  },
  {
    menu: ["Sub-Sectororial Illustration"],
  },

  {
    sectionTitle: "Master Report",
    menu: ["Performance Report"],
    icon: <TbReportAnalytics size={23} className="text-white" />,
  },
  {
    menu: ["Report Affiliated"],
  },
];

export default Datas;
