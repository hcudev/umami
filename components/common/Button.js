import React from 'react';
import classNames from 'classnames';
import Icon from './Icon';
import styles from './Button.module.css';

export default function Button({
  type = 'button',
  icon,
  size,
  variant,
  children,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(styles.button, className, {
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
        [styles.action]: variant === 'action',
        [styles.danger]: variant === 'danger',
      })}
      {...props}
    >
      {icon && <Icon icon={icon} size={size} />}
      {children}
    </button>
  );
}
