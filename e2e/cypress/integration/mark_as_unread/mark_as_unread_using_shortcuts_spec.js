// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @mark_as_unread

import {verifyPostNextToNewMessageSeparator, beUnread, switchToChannel, beRead, markAsUnreadFromMenu, showCursor} from './helpers';

describe('Mark as Unread using', () => {
    let testUser;

    let channelA;
    let channelB;

    let post1;
    let post2;

    beforeEach(() => {
        cy.apiAdminLogin();
        cy.apiInitSetup().then(({team, channel, user}) => {
            testUser = user;
            channelA = channel;

            // # Create second channel and add testUser
            cy.apiCreateChannel(team.id, 'channel-b', 'Channel B').then((resp) => {
                channelB = resp.body;
                cy.apiAddUserToChannel(channelB.id, testUser.id);
            });

            // # Create second user and add him to the team
            cy.apiCreateUser().then(({user: user2}) => {
                const otherUser = user2;

                cy.apiAddUserToTeam(team.id, otherUser.id).then(() => {
                    cy.apiAddUserToChannel(channelA.id, otherUser.id);

                    // Another user creates posts in the channel since you can't mark your own posts unread currently
                    cy.postMessageAs({sender: otherUser, message: 'post1', channelId: channelA.id}).then((p1) => {
                        post1 = p1;

                        cy.postMessageAs({sender: otherUser, message: 'post2', channelId: channelA.id}).then((p2) => {
                            post2 = p2;
                        });
                    });
                });
            });

            cy.apiLogin(testUser);
            cy.visit(`/${team.name}/channels/${channelA.name}`);
        });
    });

    it('using shortcuts to make post unread', () => {
        // * Hower on the post with holding alt should show cursor
        cy.get(`#post_${post2.id}`).trigger('mouseover').type('{alt}', {release: false}).should(showCursor);

        // # Mouse click on the post holding alt
        cy.get(`#post_${post2.id}`).type('{alt}', {release: false}).click();

        // * Verify the post is marked as unread
        verifyPostNextToNewMessageSeparator('post2');

        // * Verify the channelA has unread in LHS
        cy.get(`#sidebarItem_${channelA.name}`).should(beUnread);

        // # Switch to channelB
        switchToChannel(channelB);

        // # Switch to channelA
        switchToChannel(channelA);

        // * Verify the channelA has does not have unread in LHS
        cy.get(`#sidebarItem_${channelA.name}`).should(beRead);

        // # Open RHS (reply thread)
        cy.clickPostCommentIcon(post1.id);

        // # Mark the post as unread from RHS
        markAsUnreadFromMenu(post1, 'rhsPostMessageText', 'RHS_ROOT');

        // The New Messages line should appear above the selected post
        verifyPostNextToNewMessageSeparator('post1');

        // * Verify the channelA has unread in LHS
        cy.get(`#sidebarItem_${channelA.name}`).should(beUnread);
    });
});
