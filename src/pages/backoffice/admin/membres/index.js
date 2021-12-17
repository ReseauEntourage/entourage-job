import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import { MEMBER_FILTERS_DATA, USER_ROLES } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import MemberList from 'src/components/backoffice/admin/MemberList';

const MembersAdmin = () => {
  const {
    isReady,
    replace,
    query: { role, ...restParams },
  } = useRouter();

  const [filtersConst, setFiltersConst] = useState(MEMBER_FILTERS_DATA);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const { user } = useContext(UserContext);

  const prevRole = usePrevious(role);
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (isReady) {
      if (user) {
        if (!role) {
          const params = { role: 'All', ...restParams };

          if (user && user.zone) {
            params.zone = user.zone;
          }
          replace(
            {
              pathname: '/backoffice/admin/membres',
              query: params,
            },
            undefined,
            { shallow: true }
          );
        } else {
          setLoadingDefaultFilters(false);
        }
      }
    }
  }, [isReady, replace, restParams, role, user]);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    filtersConst,
    {
      href: '/backoffice/admin/membres',
    }
  );

  useEffect(() => {
    if (role !== prevRole) {
      const initialFiltersConst =
        role === USER_ROLES.COACH
          ? MEMBER_FILTERS_DATA.slice(0, 2)
          : MEMBER_FILTERS_DATA;

      setFiltersConst(initialFiltersConst);
    }
  }, [loadingDefaultFilters, prevRole, prevUser, role, setFilters, user]);

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section>
        {loadingDefaultFilters ? (
          <div className="uk-text-center">
            <div data-uk-spinner />
          </div>
        ) : (
          <MemberList
            filtersConst={filtersConst}
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

export default MembersAdmin;
