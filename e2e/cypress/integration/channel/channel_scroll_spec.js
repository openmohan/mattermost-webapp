// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @channel @channel_settings

describe('Close direct messages', () => {
    let testUser;
    let testTeam;

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            testUser = user;
            testTeam = team;

            // # Login as test user and go to town square
            cy.apiLogin(testUser);
            cy.visit(`/${testTeam.name}/channels/town-square`);
        });
    });
});