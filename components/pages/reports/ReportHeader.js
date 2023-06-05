import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Icon, LoadingButton, InlineEditField, useToast } from 'react-basics';
import PageHeader from 'components/layout/PageHeader';
import { useMessages, useApi } from 'hooks';
import { ReportContext } from './Report';
import styles from './ReportHeader.module.css';
import reportStyles from './reports.module.css';

export function ReportHeader({ icon }) {
  const { report, updateReport } = useContext(ReportContext);
  const { formatMessage, labels, messages } = useMessages();
  const { toast, showToast } = useToast();
  const { post, useMutation } = useApi();
  const router = useRouter();
  const { mutate: create, isLoading: isCreating } = useMutation(data => post(`/reports`, data));
  const { mutate: update, isLoading: isUpdating } = useMutation(data =>
    post(`/reports/${data.id}`, data),
  );

  const { name, description, parameters } = report || {};
  const { websiteId, dateRange } = parameters || {};

  const handleSave = async () => {
    if (!report.id) {
      create(report, {
        onSuccess: async ({ id }) => {
          router.push(`/reports/${id}`, null, { shallow: true });
          showToast({ message: formatMessage(messages.saved), variant: 'success' });
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
    updateReport({ name });
  };

  const handleDescriptionChange = description => {
    updateReport({ description });
  };

  const Title = () => {
    return (
      <>
        <Icon size="lg">{icon}</Icon>
        <InlineEditField name="name" value={name} onCommit={handleNameChange} />
      </>
    );
  };

  return (
    <div className={reportStyles.header}>
      <PageHeader title={<Title />}>
        <LoadingButton
          variant="primary"
          loading={isCreating || isUpdating}
          disabled={!websiteId || !dateRange?.value || !name}
          onClick={handleSave}
        >
          {formatMessage(labels.save)}
        </LoadingButton>
      </PageHeader>
      <div className={styles.description}>
        <InlineEditField
          name="description"
          value={description}
          placeholder={`+ ${formatMessage(labels.addDescription)}`}
          onCommit={handleDescriptionChange}
        />
      </div>
      {toast}
    </div>
  );
}

export default ReportHeader;
