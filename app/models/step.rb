class Step < ActiveRecord::Base
  FLAGS = %w(
    proposals
    enable_proposal_votes
    enable_proposal_scope
    enable_proposal_unvote
    enable_proposal_creation
    enable_proposal_comments
    action_plans
    meetings
    debates
    dataviz
    categories
  )

  belongs_to :participatory_process
  validates :participatory_process, presence: true

  acts_as_paranoid column: :hidden_at
  include ActsAsParanoidAliases

  serialize :title, JSON
  serialize :summary, JSON
  serialize :description, JSON

  def self.step_for(participatory_process, flag)
    participatory_process.steps.select{ |s| s.enabled? }.detect do |step|
      step.flags.map(&:to_s).include?(flag.to_s)
    end
  end

  def feature_enabled?(name)
    flags.include?(name.to_s)
  end

  def current?
    participatory_process.active_step == self
  end

  def enabled?
    return false unless position
    return false unless participatory_process.active_step

    position <= participatory_process.active_step.position
  end
end
