import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import Menu from './Menu';
import useDocumentClick from 'hooks/useDocumentClick';
import Chevron from 'assets/chevron-down.svg';
import styles from './Dropdown.module.css';
import Icon from './Icon';

export default function DropDown({
  value,
  className,
  menuClassName,
  options = [],
  onChange = () => {},
}) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();

  function handleShowMenu() {
    setShowMenu(state => !state);
  }

  function handleSelect(selected, e) {
    e.stopPropagation();
    setShowMenu(false);

    onChange(selected);
  }

  useDocumentClick(e => {
    if (!ref.current.contains(e.target)) {
      setShowMenu(false);
    }
  });

  return (
    <div ref={ref} className={classNames(styles.dropdown, className)} onClick={handleShowMenu}>
      <div className={styles.value}>
        <div>{options.find(e => e.value === value)?.label || value}</div>
        <Icon icon={<Chevron />} size="small" />
      </div>
      {showMenu && (
        <Menu className={menuClassName} options={options} onSelect={handleSelect} float="bottom" />
      )}
    </div>
  );
}
