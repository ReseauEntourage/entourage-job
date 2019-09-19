import React from 'react';
import { useRouter } from 'next/router';
import { DiscovertPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cards';
import Layout from '../../components/Layout';

const CV = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout
      title={`${id} - Entourage Jobs`}
      metaUrl={`https://entourage-job-preprod.herokuapp.com/cv/${id}`}
      metaDescription="Motivée et curieuse, j'aimerais beaucoup travailler dans la gestion ou l'administration mais reste ouverte à toutes autres propositions."
      metaImage="https://entourage-job-preprod.herokuapp.com/static/img/arthur-preview.jpg"
    >
      <div style={{ position: 'relative' }}>
        <CVBackground url="https://www.telegraph.co.uk/content/dam/Travel/2018/October/bear%20standing.jpg?imwidth=1400" />
        <CVFiche id={id} />
        <ContactPartial />
        <DiscovertPartial />
      </div>
    </Layout>
  );
};

export default CV;
