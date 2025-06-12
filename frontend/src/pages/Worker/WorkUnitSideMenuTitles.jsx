import { MdOutlineDisplaySettings } from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import { FcPlanner } from "react-icons/fc";
import { TbReportAnalytics } from "react-icons/tb";

const Datas = [
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

  { menu: ["Export and Reporting"] },

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
