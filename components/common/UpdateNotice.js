import React from 'react';
import { FormattedMessage } from 'react-intl';
import useVersion from 'hooks/useVersion';
import styles from './UpdateNotice.module.css';
import ButtonLayout from '../layout/ButtonLayout';
import Button from './Button';
import useForceUpdate from '../../hooks/useForceUpdate';

export default function UpdateNotice() {
  const forceUpdte = useForceUpdate();
  const { hasUpdate, latest, updateCheck } = useVersion(true);

  function handleViewClick() {
    location.href = 'https://github.com/mikecao/umami/releases';
    updateCheck();
    forceUpdte();
  }

  function handleDismissClick() {
    updateCheck();
    forceUpdte();
  }

  if (!hasUpdate) {
    return null;
  }

  return (
    <div className={styles.notice}>
      <div className={styles.message}>
        <FormattedMessage
          id="message.new-version-available"
          defaultMessage="A new version of umami {version} is available!"
          values={{ version: `v${latest}` }}
        />
      </div>
      <ButtonLayout>
        <Button size="xsmall" variant="action" onClick={handleViewClick}>
          <FormattedMessage id="button.view-details" defaultMessage="View details" />
        </Button>
        <Button size="xsmall" onClick={handleDismissClick}>
          <FormattedMessage id="button.dismiss" defaultMessage="Dismiss" />
        </Button>
      </ButtonLayout>
    </div>
  );
}
