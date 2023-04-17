import classNames from 'classnames';
import { Menu, Item } from 'react-basics';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './SideNav.module.css';

export default function SideNav({ selectedKey, items, shallow, onSelect = () => {} }) {
  const { asPath } = useRouter();
  return (
    <Menu items={items} selectedKey={selectedKey} className={styles.menu} onSelect={onSelect}>
      {({ key, label, url }) => (
        <Item
          key={key}
          className={classNames(styles.item, { [styles.selected]: asPath.startsWith(url) })}
        >
          <Link href={url} shallow={shallow}>
            {label}
          </Link>
        </Item>
      )}
    </Menu>
  );
}
