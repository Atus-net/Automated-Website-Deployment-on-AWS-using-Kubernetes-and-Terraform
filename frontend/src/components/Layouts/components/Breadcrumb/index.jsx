import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ items }) => {
  const mappedItems = items.map((item) => ({
    title: item.link ? <Link to={item.link}>{item.title}</Link> : item.title,
  }));

  return <Breadcrumb items={mappedItems} />;
};

export default BreadCrumb;
