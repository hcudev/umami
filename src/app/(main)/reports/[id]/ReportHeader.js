import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, LoadingButton, InlineEditField, useToasts, Loading } from 'react-basics';
import PageHeader from 'components/layout/PageHeader';
import { useMessages, useApi } from 'components/hooks';
import { ReportContext } from './Report';
import styles from './ReportHeader.module.css';
import reportStyles from './Report.module.css';
import { REPORT_TYPES } from 'lib/constants';

export function ReportHeader({ icon }) {
  const { report, updateReport } = useContext(ReportContext);
  const { formatMessage, labels, messages } = useMessages();
  const { showToast } = useToasts();
  const { post, useMutation } = useApi();
  const router = useRouter();
  const { mutate: create, isLoading: isCreating } = useMutation(data => post(`/reports`, data));
  const { mutate: update, isLoading: isUpdating } = useMutation(data =>
    post(`/reports/${data.id}`, data),
  );

  const { name, description, parameters } = report || {};
  const { websiteId, dateRange } = parameters || {};
  const defaultName = formatMessage(labels.untitled);

  const handleSave = async () => {
    if (!report.id) {
      create(report, {
        onSuccess: async ({ id }) => {
          showToast({ message: formatMessage(messages.saved), variant: 'success' });
          router.push(`/reports/${id}`, null, { shallow: true });
        },
      });
    } else {
      update(report, {
        onSuccess: async () => {
          showToast({ message: formatMessage(messages.saved), variant: 'success' });
        },
      });
    }
  };

  const handleNameChange = name => {
    updateReport({ name: name || defaultName });
  };

  const handleDescriptionChange = description => {
    updateReport({ description });
  };

  const Title = () => {
    return (
      <div className={styles.header}>
        <div className={styles.type}>
          {formatMessage(
            labels[Object.keys(REPORT_TYPES).find(key => REPORT_TYPES[key] === report?.type)],
          )}
        </div>
        <div className={styles.title}>
          <Icon size="lg">{icon}</Icon>
          <InlineEditField
            key={name}
            name="name"
            value={name}
            placeholder={defaultName}
            onCommit={handleNameChange}
          />
        </div>
      </div>
    );
  };

  if (!report) {
    return <Loading />;
  }

  return (
    <div className={reportStyles.header}>
      <PageHeader title={<Title />}>
        <LoadingButton
          variant="primary"
          isLoading={isCreating || isUpdating}
          disabled={!websiteId || !dateRange?.value || !name}
          onClick={handleSave}
        >
          {formatMessage(labels.save)}
        </LoadingButton>
      </PageHeader>
      <div className={styles.description}>
        <InlineEditField
          key={description}
          name="description"
          value={description}
          placeholder={`+ ${formatMessage(labels.addDescription)}`}
          onCommit={handleDescriptionChange}
        />
      </div>
    </div>
  );
}

export default ReportHeader;
