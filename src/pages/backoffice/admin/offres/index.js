import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'src/components/store/UserProvider';
import { usePrevious } from 'src/hooks/utils';
import { useFilters } from 'src/hooks';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import AdminOpportunityList from 'src/components/backoffice/admin/AdminOpportunityList';
import { useRouter } from 'next/router';

const LesOpportunites = () => {
  const {
    push,
    query: { offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const prevUser = usePrevious(user);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    OPPORTUNITY_FILTERS_DATA,
    {
      href: '/backoffice/admin/offres',
    }
  );

  useEffect(() => {
    if (user) {
      if (!tag) {
        const params = { tag: OFFER_ADMIN_FILTERS_DATA[1].tag, ...restParams };

        if (user && user.zone) {
          const defaultDepartmentsForAdmin = DEPARTMENTS_FILTERS.filter(
            (dept) => {
              return user.zone === dept.zone;
            }
          );

          params.department = defaultDepartmentsForAdmin.map((dept) => {
            return dept.value;
          });
        }
        if (offerId) {
          push(
            {
              pathname: '/backoffice/admin/offres/[offerId]',
              query: params,
            },
            {
              pathname: `/backoffice/admin/offres/${offerId}`,
              query: params,
            },
            {
              shallow: true,
            }
          );
        } else {
          push(
            {
              pathname: '/backoffice/admin/offres',
              query: params,
            },
            undefined,
            {
              shallow: true,
            }
          );
        }
      } else {
        setLoadingDefaultFilters(false);
      }
    }
  }, [offerId, prevUser, push, restParams, tag, user]);

  if (!user) return null;

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        {loadingDefaultFilters ? (
          <div className="uk-text-center">
            <div data-uk-spinner />
          </div>
        ) : (
          <AdminOpportunityList
            search={search}
            filters={filters}
            resetFilters={resetFilters}
            setSearch={setSearch}
            setFilters={setFilters}
          />
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default LesOpportunites;
