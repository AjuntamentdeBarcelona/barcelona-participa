import { Component, PropTypes } from 'react';
import { connect }              from 'react-redux';

import * as actions             from './proposals.actions';

import Icon                     from '../application/icon.component';
import Loading                  from '../application/loading.component';
import DangerLink               from '../application/danger_link.component';
import FilterMeta               from '../filters/filter_meta.component';
import FollowButton             from '../follows/follow_button.component';
import Comments                 from '../comments/comments.component';

import ProposalInfoExtended     from './proposal_info_extended.component';
import ProposalActionPlans      from './proposal_action_plans.component';
import ProposalMeetings         from './proposal_meetings.component';
import ProposalAnswerMessage    from './proposal_answer_message.component';
import ProposalVoteButton       from './proposal_vote_button.component';

import htmlToReact              from '../application/html_to_react';
import simpleFormat             from '../application/simple_format';

class ProposalShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    const { fetchProposal, fetchAnswer, proposalId } = this.props;

    fetchProposal(proposalId).then(() => {
      this.setState({ loading: false });
    });

    fetchAnswer(proposalId);
  }

  render() {
    return (
      <div className="proposal-show component">
        <Loading show={this.state.loading} />
        {this.renderProposal()}
      </div>
    );
  }

  renderProposal() {
    const { proposal } = this.props;

    if (proposal.id) {
      const { 
        id,
        code,
        url, 
        title, 
        created_at, 
        author,
        summary,
        voted,
        votable,
        total_votes,
        total_comments,
        scope_,
        district,
        category,
        subcategory,
        editable,
        flagged,
        closed,
        hidden,
        can_hide,
        can_hide_author,
        external_url,
        conflictive
      } = proposal;

      return (
        <div className={(hidden || (author && author.hidden)) ? 'faded' : ''} id={`proposal_${proposal.id}`}>
          <div>
            <div className="row column view-header">
              {this.renderEditButton(editable, url)}
              <h2 className="heading2">{title}</h2>
              <ProposalInfoExtended
                id={ id }
                created_at={ created_at }
                author={ author }
                totalComments={ total_comments } 
                flagged={ flagged } />
              <div className="js-moderator-proposal-actions margin">
                {this.renderHideButton(id, can_hide)}
                {this.renderHideAuthorButton(id, can_hide_author)}
                {this.renderBuildActionPlanButton(id)}
              </div>
            </div>
            {this.renderConflictiveWarning(conflictive)}
            <div className="row">
              <div className="columns section view-side mediumlarge-4 mediumlarge-push-8 large-3 large-push-9">
                <div className="card extra">
                  <div className="card__content">
                    <span className="extra__suport-number">{ total_votes }</span>
                    <span className="extra__suport-text">{ I18n.t("votes.supports") }</span>
                    <ProposalVoteButton
                      className="expanded button--sc extra"
                      closed={closed}
                      voted={voted}
                      votable={votable}
                      proposalId={id}
                    />
                    <FollowButton 
                      followingId={id}
                      followingType={'Proposal'} />
                  </div>
                </div>
                <div className="reference">
                  Referencia: {code}
                </div>
                <div className="text-center">
                  <button className="link text-center">
                    Compartir propuesta
                    <Icon name="share" className="icon--share icon--after" />
                  </button>
                </div>
              </div>
              <div className="columns mediumlarge-8 mediumlarge-pull-4">
                <div className="section">
                  {this.renderStatusBadge()}
                  {htmlToReact(simpleFormat(summary))}
                  <br />
                  {this.renderExternalUrl(external_url)}
                  <FilterMeta 
                    scope={ scope_ }
                    district={ district }
                    category={ category }
                    subcategory={ subcategory } 
                    useServerLinks={ true }/>
                </div>
                <ProposalAnswerMessage answer={proposal.answer} />
                <div className="section">
                  <ProposalActionPlans />
                </div>
                <div className="section">
                  <ProposalMeetings useServerLinks={ true } />
                </div>
              </div>
            </div>
          </div>
          <div className="expanded">
            <div className="wrapper--inner">
              <div className="row">
                <div className="columns large-9" id="comments">
                  <Comments commentable={{...proposal, type: 'Proposal'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  renderStatusBadge() {
    const { proposal } = this.props;
    const { answer } = proposal;

    if (answer) {
      const { status } = answer;

      if (status === 'accepted') {
        return (
          <span className="success label proposal-status">Acceptada</span>
        );
      } else if (status === 'rejected') {
        return (
          <span className="warning label proposal-status">Rebutjada</span>
        );
      }
    }
    return null;
  }

  renderEditButton(editable, url) {
    if (editable) {
      return (
        <a href={`${url}/edit`} className="edit-proposal button success tiny radius right">
          <i className="icon-edit"></i>
          { I18n.t("proposals.show.edit_proposal_link") }
        </a>
      );
    }

    return null;
  }

  renderHideButton(id, hasPermission) {
    const { hideProposal } = this.props;

    if (hasPermission) {
      return (
        <DangerLink onClick={() => hideProposal(id)}>
          { I18n.t('admin.actions.hide') }
        </DangerLink>
      );
    }
    return null;
  }

  renderHideAuthorButton(id, hasPermission) {
    const { hideProposalAuthor } = this.props;

    if (hasPermission) {
      return (
        <span>
          <span>&nbsp;|&nbsp;</span>
          <DangerLink onClick={() => hideProposalAuthor(id)}>
            { I18n.t('admin.actions.hide_author') }
          </DangerLink>
        </span>
      );
    }
    return null;
  }

  renderBuildActionPlanButton(id) {
    const { session, participatoryProcessId, stepId } = this.props;

    if (session.can_create_action_plan) {
      return (
        <span>
          <span>&nbsp;|&nbsp;</span>
          <a href={`/${participatoryProcessId}/${stepId}/action_plans/build_from_proposal?proposal_id=${id}`}>
            { I18n.t('admin.actions.build_action_plan') }
          </a>
        </span>
      );
    }
    return null;
  }

  renderConflictiveWarning(isConflictive) {
    if (isConflictive) {
      return (
        <div className="alert-box alert radius margin-top">
          <strong>{ I18n.t("proposals.show.flag") }</strong>
        </div>
      );
    }
    
    return null;
  }

  renderExternalUrl(externalUrl) {
    if (externalUrl) {
      return (
        <div className="document-link">
          { htmlToReact(simpleFormat(externalUrl)) }
        </div>
      );
    }

    return null;
  }
}

export default connect(
  ({ session, proposal, participatoryProcessId, stepId }) => ({ session, proposal, participatoryProcessId, stepId}),
  actions
)(ProposalShow);

ProposalShow.propTypes = {
  session: PropTypes.object.isRequired,
  proposalId: PropTypes.string.isRequired,
  proposal: PropTypes.object,
  fetchProposal: PropTypes.func.isRequired,
  fetchAnswer: PropTypes.func.isRequired,
  hideProposal: PropTypes.func.isRequired,
  hideProposalAuthor: PropTypes.func.isRequired,
  stepId: PropTypes.string.isRequired,
  participatoryProcessId: PropTypes.string.isRequired
};
