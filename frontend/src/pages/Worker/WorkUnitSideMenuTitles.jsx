import { MdOutlineDisplaySettings } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { FcPlanner } from "react-icons/fc";
import { TbReportAnalytics } from "react-icons/tb";
import { FaChartLine, FaFileExport, FaChartPie, FaFileAlt } from "react-icons/fa";

const Datas = [
  {
    sectionTitle: "Annual/Quarterly",
    key: "annual",
    menu: "Planning",
    icon: <FcPlanner size={20} />,
  },
  {
    menu: "Performance",
    key: "performance",
    icon: <FaChartLine size={16} color="#F36F21" />,
  },
  {
    sectionTitle: "Data Management",
    key: "dataManagement",
    menu: "Performance Alert",
    icon: <MdOutlineDisplaySettings size={20} color="#F36F21" />,
  },
  {
    menu: "Export and Reporting",
    key: "reporting",
    icon: <FaFileExport size={16} color="#F36F21" />,
  },
  {
    sectionTitle: "Data Analysis",
    key: "dataAnalysis",
    menu: "Sectorial Illustration",
    icon: <IoAnalyticsSharp size={20} color="#F36F21" />,
  },
  {
    menu: "Sub-Sectorial Illustration",
    key: "subsectorial",
    icon: <FaChartPie size={16} color="#F36F21" />,
  },
  {
    sectionTitle: "Master Report",
    key: "masterReport",
    menu: "Performance Report",
    icon: <TbReportAnalytics size={20} color="#F36F21" />,
  },
  {
    menu: "Report Affiliated",
    key: "reportAffiliated",
    icon: <FaFileAlt size={16} color="#F36F21" />,
  },
];

export default Datas;
