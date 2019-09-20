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
      metaTitle={`${id} - Entourage Jobs`}
      metaUrl={`https://localhost:5001/cv/${id}`}
      metaDescription="Motivée et curieuse, j'aimerais beaucoup travailler dans la gestion ou l'administration mais reste ouverte à toutes autres propositions."
      metaImage="https://localhost:5001/static/img/arthur.png"
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
