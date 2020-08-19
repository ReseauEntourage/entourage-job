describe('CRUD Opportunity', () => {
    describe('C - Opportunity', () => {
        describe('Anybody can create opportunities - /', () => {
            describe('Should return 200, if valid opportunity', async () => {

            });
            describe('Should return 401, if invalid opportunity', async () => {

            });
        });
        describe('Add a user to an opportunity - /join', () => {
            describe('should return 200, if candidat had himself to an opportunity', async () => {

            });
            describe(
                'should return 200, if a coach had his associated candidat to an opportunity',
                async () => {

                });
            describe('should return 200, if admin had candidat to an opportunity', async () => {

            });
            describe('should return 401, if invalid opportunity id', async () => {

            });
            describe('should return 401, if candidat updates an other candidat', async () => {

            });
            describe('should return 401, if a coach updates not associate candidat', async () => {

            });
        });
    });
    describe('R - Read 1 opportunity', () => {

    });
    describe('R - Read Many opportunities', () => {
        describe('Read all opportunities - /admin', () => {
            describe('Should return 200 and a list of opportunities, if logged in admin', () => {

            });
            describe('Should return 401, if not logged in admin', () => {

            });
        });
        describe('Read a user\'s private opportunities - /user/private/:id', () => {
            describe('should return 200, if candidat read his opportunities', async () => {

            });
            describe(
                'should return 200, if a coach read his associated candidat opportunities',
                async () => {

                });
            describe(
                'should return 200, if a admin read his associated candidat opportunities',
                async () => {

                });
            describe('should return 401, if invalid user id', async () => {

            });
            describe(
                'should return 401, if candidat reads an other candidat opportunities',
                async () => {

                });
            describe(
                'should return 401, if a coach read not associate candidat\'s opportunities',
                async () => {

                });
        });
        // TODO : check if this route also gets private opportunities
        describe('Read all user\'s opportunities - /user/all/:id', () => {
            describe('should return 200, if candidat read his opportunities', async () => {

            });
            describe(
                'should return 200, if a coach read his associated candidat opportunities',
                async () => {

                });
            describe(
                'should return 200, if a admin read his associated candidat opportunities',
                async () => {

                });
            describe('should return 401, if invalid user id', async () => {

            });
            describe(
                'should return 401, if candidat reads an other candidat opportunities',
                async () => {

                });
            describe(
                'should return 401, if a coach read not associate candidat\'s opportunities',
                async () => {

                });
        });
    });
    describe('U - Update 1', () => {
        describe('Update an oppotunity - /', () => {
            describe('Should return 200, if admin updates an opportunity', async () => {

            });
            describe('Should return 401, if no an admin', async () => {

            });
        });
        describe('Update a user opportunity association - /join', () => {
            describe(
                'should return 200, if candidat updates his opportunities asociations',
                async () => {

                });
            describe(
                'should return 200, if a coach updates his associated candidat opportunities asociations', async () => {

                });
            describe(
                'should return 200, if a admin updates candidat opportunities asociations',
                async () => {

                });
            describe('should return 401, if invalid user id', async () => {

            });
            describe(
                'should return 401, if candidat updates an other candidat opportunities asociations',
                async () => {

                });
            describe(
                'should return 401, if a coach updates not associate candidat\'s opportunities asociations',
                async () => {

                });
        });
    });
    describe('D - Delete 1', () => {
        describe('Should return 200, if admin', async () => {

        });
        describe('Should return 401, if not admin', async () => {

        });

    })
});