// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {callbackify} from 'util';

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

    it('MM-T2365 Scrolling in the channel is disabled when emoji picker is open', () => {
        // # Add 30 posts to create enough space from bottom for making channel scrollable
        for (let index = 0; index < 3; index++) {
            cy.postMessage(`This is an old message [${index}]`);
        }

        cy.get('#emojiPickerButton').should('be.visible').click();

        cy.get('#root').should('have.class', 'emoji-picker--active');

        cy.get('#emojiPickerButton').should('be.visible').click();

        cy.get('#root').should('not.have.class', 'emoji-picker--active');

        cy.getLastPostId().then((postId) => {
            cy.clickPostDotMenu(postId);
            cy.contains('Reply').click();
        });
    });
});