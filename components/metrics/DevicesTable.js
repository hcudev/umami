import React from 'react';
import MetricsTable from './MetricsTable';
import { deviceFilter } from 'lib/filters';
import { FormattedMessage } from 'react-intl';
import { getDeviceMessage } from 'components/messages';

export default function DevicesTable({ websiteId, limit, onExpand }) {
  return (
    <MetricsTable
      title={<FormattedMessage id="metrics.devices" defaultMessage="Devices" />}
      type="device"
      metric={<FormattedMessage id="metrics.visitors" defaultMessage="Visitors" />}
      websiteId={websiteId}
      limit={limit}
      dataFilter={deviceFilter}
      renderLabel={({ x }) => getDeviceMessage(x)}
      onExpand={onExpand}
    />
  );
}
