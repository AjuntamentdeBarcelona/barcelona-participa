class SpendingProposalsController < ApplicationController
  include HasParticipatoryProcess
  include FeatureFlags

  before_action :authenticate_user!, except: [:index]

  load_and_authorize_resource

  feature_flag :spending_proposals

  def index
  end

  def new
    @spending_proposal = SpendingProposal.new
  end

  def create
    @spending_proposal = SpendingProposal.new(spending_proposal_params)
    @spending_proposal.author = current_user

    if verify_recaptcha(model: @spending_proposal) && @spending_proposal.save
      redirect_to spending_proposals_path, notice: t("flash.actions.create.spending_proposal")
    else
      render :new
    end
  end

  private

    def spending_proposal_params
      params.require(:spending_proposal).permit(:title, :description, :external_url, :geozone_id, :terms_of_service)
    end

end
