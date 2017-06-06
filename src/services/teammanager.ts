import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;
import {EventEmitter} from "events";

class Team {
    public teamId: number;
    public teamName: string;

    public constructor(teamId: number, teamName: string) {
        this.teamId = teamId;
        this.teamName = teamName;
    }
}

class JoinRequest {
    public id: number;
    public teamId: number;
    public memberName: string;

    public constructor(id: number, teamId: number, memberName: string) {
        this.id = id;
        this.teamId = teamId;
        this.memberName = memberName;
    }
}

class Member {
    public id: number;
    public teamId: number;
    public memberName: string;


    public constructor(id: number, teamId: number, memberName: string) {
        this.id = id;
        this.teamId = teamId;
        this.memberName = memberName;
    }
}

class JoinRequestElement extends EventEmitter {
    public element: HTMLDivElement;
    public requestId: number;

    public constructor(requestId: number, memberName: string) {
        super();
        this.requestId = requestId;
        this.element = document.createElement('div');
        this.element.className = "join-request-content";
        this.element.innerHTML = `
        ${memberName}<br /> ask for join
            <div class="join-request-buttons">
                <span class="approve">
                    <i class="fa fa-thumbs-o-up approve fa-2x" aria-hidden="true"></i>
                </span>
                <span class="decline">
                    <i class="fa fa-thumbs-o-down decline fa-2x" aria-hidden="true"></i>
                </span>
            </div>
        `;
        $('.approve', this.element).on('click', function () {
            this.emit('approve', requestId);
        }.bind(this));
        $('.decline', this.element).on('click', function () {
            this.emit('decline', requestId);
        }.bind(this));
    }
}

class JoinRequestList {
    private container: HTMLDivElement;
    private world: Game;
    private requests: Map<JoinRequest> = {};
    private currentElement: JoinRequestElement;

    public constructor(world: Game, container: HTMLDivElement) {
        this.world = world;
        this.container = container;
    }

    public clear() {
        let keys = Object.keys(this.requests);
        for (let key of keys) {
            this.removeJoinRequest(parseInt(key));
        }
    }

    public addJoinRequest(joinRequest: JoinRequest) {
        this.requests[joinRequest.id] = joinRequest;
        if (!this.currentElement) {
            this.show(joinRequest.id);
        }
    }

    public removeJoinRequest(joinRequestId: number) {
        delete this.requests[joinRequestId];
        if (this.currentElement && this.currentElement.requestId === joinRequestId) {
            this.hide();
            if (Object.keys(this.requests).length > 0) {
                this.show(Object.keys(this.requests)[0]);
            }
        }
    }

    private show(id) {
        if (this.requests[id]) {
            this.currentElement = new JoinRequestElement(id, this.requests[id].memberName);
            this.currentElement.on('approve', function (id: number) {
                (this.world.services.getService(TeamManager) as TeamManager).requestApprove(id);
                this.removeJoinRequest(id);
            }.bind(this));
            this.currentElement.on('decline', function (id: number) {
                (this.world.services.getService(TeamManager) as TeamManager).requestDecline(id);
                this.removeJoinRequest(id);
            }.bind(this));

            this.container.appendChild(this.currentElement.element);
            this.container.style.visibility = "visible";
        }
    }

    private hide() {
        if (this.currentElement) {
            this.container.removeChild(this.currentElement.element);
            this.currentElement = null;
            this.container.style.visibility = "hidden";
        }
    }
}

class TeamListElement extends EventEmitter {
    public element: HTMLElement;
    private joinButton: HTMLElement;

    public constructor(teamId: number, teamName: string) {
        super();
        this.element = document.createElement('div');
        this.element.className = 'ui-team-list-item';
        this.element.innerHTML = `
            <div class="ui-join-button">
                JOIN
            </div>
            <div class="ui-team-name">
                ${teamName}
            </div>
        `;
        this.joinButton = $('.ui-join-button', this.element).get(0);
        this.joinButton.onclick = function () {
            this.emit('join-request', teamId);
        }.bind(this);
    }

    public setJoinStatus(flag: boolean) {
        if (flag) {
            this.joinButton.classList.add('loading');
            this.joinButton.innerHTML = '<i class="fa fa-spin fa-spinner" aria-hidden="true"></i> REQUESTED';
        } else {
            this.joinButton.classList.remove('loading');
            this.joinButton.innerHTML = `JOIN`;
        }
    }
}

class TeamList {

    private container: HTMLDivElement;
    private listContainer: HTMLDivElement;
    private elements: Map<TeamListElement> = {};
    private world: Game;

    public constructor(world: Game, container: HTMLDivElement, listContainer: HTMLDivElement) {
        this.listContainer = listContainer;
        this.container = container;
        this.world = world;
    }

    public addTeam(team: Team) {
        let element = new TeamListElement(team.teamId, team.teamName);
        this.listContainer.appendChild(element.element);
        this.elements[team.teamId] = element;
        element.on('join-request', function (teamId: number) {
            (this.world.services.getService(TeamManager) as TeamManager).requestJoin(teamId);
        }.bind(this));
    }

    public removeTeam(teamId: number) {
        if (this.elements[teamId]) {
            this.elements[teamId].element.parentNode.removeChild(this.elements[teamId].element);
            delete this.elements[teamId];
        }
    }

    public setJoinStatus(teamId: number|string, status: boolean) {
        if (this.elements[teamId]) {
            this.elements[teamId].setJoinStatus(status);
        }
    }

    public toggle(flag: boolean) {
        this.container.style.visibility = flag ? "visible" : "hidden";
    }
}

class MemberListElement extends EventEmitter {
    public element: HTMLElement;

    public constructor(world: Game, memberId: number, memberName: string) {
        super();
        this.element = document.createElement('div');
        this.element.className = 'ui-member-list-item';
        this.element.innerHTML = `
            ${(world.isAdmin && memberId !== world.networkId) ? '<div class="ui-kick-button">KICK</div>' : ''}
            <div class="ui-team-name">
                ${memberName}
            </div>
        `;
        if (world.isAdmin && memberId !== world.networkId) {
            (this.element.childNodes[1] as HTMLDivElement).onclick = function () {
                this.emit('kick-request', memberId);
            }.bind(this);
        }
    }

    public setJoinStatus(flag: boolean) {
        if (flag) {
            (this.element.childNodes[1] as HTMLDivElement).classList.add('loading');
        } else {
            (this.element.childNodes[1] as HTMLDivElement).classList.remove('loading');
        }
    }
}

class MemberList {

    private container: HTMLDivElement;
    private content: HTMLDivElement;
    private elements: Map<MemberListElement> = {};
    private world: Game;

    public constructor(world: Game, container: HTMLDivElement, content: HTMLDivElement) {
        this.container = container;
        this.content = content;
        this.world = world;
    }

    public addMember(member: Member) {
        let element = new MemberListElement(this.world, member.id, member.memberName);
        this.content.appendChild(element.element);
        this.elements[member.id] = element;
        element.on('kick-request', function (memberId) {
            (this.world.services.getService(TeamManager) as TeamManager).requestKick(memberId);
        }.bind(this));
    }

    public removeMember(memberId: number) {
        if (this.elements[memberId]) {
            this.elements[memberId].element.parentNode.removeChild(this.elements[memberId].element);
            delete this.elements[memberId];
        }
    }

    public toggle(flag: boolean) {
        this.container.style.visibility = flag ? "visible" : "hidden";
    }

}

export default class TeamManager extends Service {
    private teams: Map<Team> = {};
    private joins: Map<JoinRequest> = {};
    private members: Map<Member> = {};
    private teamList: TeamList;
    private memberList: MemberList;
    private joinRequestList: JoinRequestList;
    private enabled: boolean = false;
    private key: Phaser.Key;

    // private teamList: TeamList;
    public constructor(world: Game) {
        super(world);

        this.teamList = new TeamList(world, document.getElementById('ui-team-list-container') as HTMLDivElement, document.getElementById('ui-team-list-content') as HTMLDivElement);
        this.memberList = new MemberList(world, document.getElementById('ui-member-list-container') as HTMLDivElement, document.getElementById('ui-member-list-content') as HTMLDivElement);
        this.joinRequestList = new JoinRequestList(world, document.getElementById('ui-join-request-list') as HTMLDivElement);

        this.world.socket.onMessage(MessageType.PlayerTeamListResponse, this.onTeamListResponse.bind(this));
        this.world.socket.onMessage(MessageType.PlayerTeamMembersResponse, this.onMemberListResponse.bind(this));
        this.world.socket.onMessage(MessageType.NotifyTeamCreated, this.onTeamCreated.bind(this));
        this.world.socket.onMessage(MessageType.NotifyTeamRemoved, this.onTeamRemoved.bind(this));
        this.world.socket.onMessage(MessageType.NotifyJoinRequestCreated, this.onJoinRequestCreated.bind(this));
        this.world.socket.onMessage(MessageType.NotifyJoinRequestRemoved, this.onJoinRequestRemoved.bind(this));
        this.world.socket.onMessage(MessageType.NotifyMemberJoin, this.onMemberJoin.bind(this));
        this.world.socket.onMessage(MessageType.NotifyMemberLeave, this.onMemberLeave.bind(this));
        this.requestTeamList();

        window.addEventListener('keydown', this.onKeyDown.bind(this), false);

        document.getElementById('ui-create-team-button').onclick = function () {
            this.requestCreateTeam((document.getElementById('ui-input-team-name') as HTMLInputElement).value);
        }.bind(this);
        document.getElementById('ui-leave-team-button').onclick = function () {
            this.requestLeave();
        }.bind(this);
        let closeButtons = document.getElementsByClassName('ui-team-list-close');
        for (let i = 0; i < closeButtons.length; i++) {
            (closeButtons.item(i) as HTMLElement).onclick = function () {
                this.toggle();
            }.bind(this);
        }
    }

    private onKeyDown(e) {
        if (this.enabled) {
            if (e.keyCode === 27) {
                this.toggle();
            }
        }
    }

    private onJoinRequestCreated(message: Message) {
        let joinRequest = new JoinRequest(message.content['id'], message.content['teamId'], message.content['fromName']);
        this.joins[joinRequest.id] = joinRequest;
        this.teamList.setJoinStatus(joinRequest.teamId, true);
        if (this.world.isAdmin && joinRequest.teamId === this.world.teamId) {
            this.joinRequestList.addJoinRequest(joinRequest);
        }
        // Setup auto approve
    }

    private onJoinRequestRemoved(message: Message) {
        let id: number = message.content['id'];
        if (this.joins[id]) {
            this.teamList.setJoinStatus(this.joins[id].teamId, false);
            delete this.joins[id];
        }
        this.joinRequestList.removeJoinRequest(id);
    }

    private onTeamListResponse(message: Message) {
        let teamIds = message.content['teamId'];
        let teamNames = message.content['teamName'];
        let memberCounts = message.content['memberCount'];

        for (let i = 0; i < teamIds.length; i++) {
            this.addTeam(teamIds[i], teamNames[i], memberCounts[i]);
        }
    }

    private onMemberListResponse(message: Message) {
        let teamId = message.content['teamId'];
        let networkIds = message.content['networkId'];
        let names = message.content['name'];

        for (let i = 0; i < networkIds.length; i++) {
            this.addMember(teamId, networkIds[i], names[i]);
        }
    }

    private onTeamCreated(message: Message) {
        this.addTeam(message.content['teamId'], message.content['teamName'], 0);
    }

    private onTeamRemoved(message: Message) {
        this.removeTeam(message.content['teamId']);
    }

    private onMemberJoin(message: Message) {
        let teamId: number = message.content['teamId'];
        let memberId: number = message.content['memberId'];
        let memberName: string = message.content['memberName'];
        this.addMember(teamId, memberId, memberName);
    }

    private onMemberLeave(message: Message) {
        let teamId: number = message.content['teamId'];
        let memberId: number = message.content['memberId'];
        this.removeMember(memberId);
    }

    public onTeamSwitch(teamId: number) {
        // Cleanup members and join requests
        this.cleanupMembers();
        if (!this.world.isAdmin) {
            this.joinRequestList.clear();
        } else {
            // Become admin, recreate requests
            for (let requestId in this.joins) {
                if (this.joins[requestId].teamId === this.world.teamId) {
                    this.joinRequestList.addJoinRequest(this.joins[requestId]);
                }
            }
        }
        for (let key in this.teams) {
            this.teamList.setJoinStatus(key, false);
        }

        // Request new members
        if (teamId > -1) {
            this.requestMemberList(teamId);
        }
        this.requestTeamList();

        this.teamList.toggle(this.enabled && this.world.teamId < 0);
        this.memberList.toggle(this.enabled && this.world.teamId > -1);
    }

    private removeTeam(teamId: number) {
        if (this.teams[teamId]) {
            delete this.teams[teamId];
            this.teamList.removeTeam(teamId);
        }
    }

    private addTeam(teamId: number, teamName: string, memberCount: number) {
        if (!this.teams[teamId]) {
            this.teams[teamId] = new Team(teamId, teamName);
            this.teamList.addTeam(this.teams[teamId]);
        }
    }

    private cleanupMembers() {
        let keys = Object.keys(this.members);
        for (let key of keys) {
            this.removeMember(key);
        }
    }

    private addMember(teamId: number, memberId: number, memberName: string) {
        if (!this.members[memberId]) {
            this.members[memberId] = new Member(memberId, teamId, memberName);
            this.memberList.addMember(this.members[memberId]);
        }
    }

    private removeMember(memberId) {
        if (this.members[memberId]) {
            this.memberList.removeMember(memberId);
            delete this.members[memberId];
        }
    }

    public requestJoin(teamId: number) {
        this.world.socket.sendMessage(MessageType.PlayerJoinTeam, {teamId: teamId});
    }

    public requestKick(userId: number) {
        this.world.socket.sendMessage(MessageType.PlayerKickRequest, {networkId: userId});
    }

    public requestCreateTeam(teamName: string) {
        this.world.socket.sendMessage(MessageType.PlayerCreateTeam, {name: teamName});
    }

    public requestLeave() {
        this.world.socket.sendMessage(MessageType.PlayerLeaveTeam, {});
    }

    public requestApprove(joinId: number) {
        this.world.socket.sendMessage(MessageType.PlayerApproveRequest, {requestId: joinId});
    }

    public requestDecline(joinId: number) {
        this.world.socket.sendMessage(MessageType.PlayerDeclineRequest, {requestId: joinId});
    }

    public requestTeamList() {
        this.world.socket.sendMessage(MessageType.PlayerTeamListRequest, {});
    }

    public requestMemberList(teamId: number) {
        this.world.socket.sendMessage(MessageType.PlayerTeamMembersRequest, {teamId: teamId});
    }

    public toggle() {
        this.enabled = !this.enabled;
        this.teamList.toggle(this.enabled && this.world.teamId < 0);
        this.memberList.toggle(this.enabled && this.world.teamId > -1);
        this.world.game.input.keyboard.enabled = !this.enabled;
        this.world.game.input.keyboard.reset(false);
    }
}