import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import { post } from 'lib/web';
import Button from 'components/common/Button';
import FormLayout, {
  FormButtons,
  FormError,
  FormMessage,
  FormRow,
} from 'components/layout/FormLayout';
import Checkbox from 'components/common/Checkbox';
import { DOMAIN_REGEX } from 'lib/constants';
import { useRouter } from 'next/router';

const initialValues = {
  name: '',
  domain: '',
  public: false,
};

const validate = ({ name, domain }) => {
  const errors = {};

  if (!name) {
    errors.name = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }
  if (!domain) {
    errors.domain = <FormattedMessage id="label.required" defaultMessage="Required" />;
  } else if (!DOMAIN_REGEX.test(domain)) {
    errors.domain = <FormattedMessage id="label.invalid-domain" defaultMessage="Invalid domain" />;
  }

  return errors;
};

export default function WebsiteEditForm({ values, onSave, onClose }) {
  const { basePath } = useRouter();
  const [message, setMessage] = useState();

  const handleSubmit = async values => {
    const { ok, data } = await post(`${basePath}/api/website`, values);

    if (ok) {
      onSave();
    } else {
      setMessage(
        data || <FormattedMessage id="message.failure" defaultMessage="Something went wrong." />,
      );
    }
  };

  return (
    <FormLayout>
      <Formik
        initialValues={{ ...initialValues, ...values, enable_share_url: !!values?.share_id }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <FormRow>
              <label htmlFor="name">
                <FormattedMessage id="label.name" defaultMessage="Name" />
              </label>
              <Field name="name" type="text" />
              <FormError name="name" />
            </FormRow>
            <FormRow>
              <label htmlFor="domain">
                <FormattedMessage id="label.domain" defaultMessage="Domain" />
              </label>
              <Field name="domain" type="text" />
              <FormError name="domain" />
            </FormRow>
            <FormRow>
              <label></label>
              <Field name="enable_share_url">
                {({ field }) => (
                  <Checkbox
                    {...field}
                    label={
                      <FormattedMessage
                        id="label.enable-share-url"
                        defaultMessage="Enable share URL"
                      />
                    }
                  />
                )}
              </Field>
            </FormRow>
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="button.save" defaultMessage="Save" />
              </Button>
              <Button onClick={onClose}>
                <FormattedMessage id="button.cancel" defaultMessage="Cancel" />
              </Button>
            </FormButtons>
            <FormMessage>{message}</FormMessage>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
}
