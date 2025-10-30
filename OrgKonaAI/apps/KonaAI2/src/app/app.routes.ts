import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { AuthGuard } from './auth/auth.guard';
import { OverviewComponent } from './overview/overview.component';
import { ProjectDashboardComponent } from './ProjectDashboard/projectDashboard.component';
import { DataImportComponent } from './data_import/data_import.component';
import { DataStagingComponent } from './data-staging/data-staging.component';
import { DataStagingHolisticComponent } from './data-staging-holistic/data-staging-holistic.component';
import { ConnectionsComponent } from './connections/connections.component';
import { DatamappingComponent } from './datamapping/datamapping.component';
import { MappingdetailsComponent } from './mappingdetails/mappingdetails.component';
import { DataValidationComponent } from './data-validations/data-validation.component';
import { VmDetailsComponent } from './vm-details/vm-details.component';
import { ProjectWorkflowComponent } from './project-workflow/project-workflow.component';
import { CreateAlertComponent } from './create-alert/create-alert.component';
import { AlertComponent } from './Alerts-Component/alert.component';
//import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { TransactionAlertComponent } from './transaction-alert/transaction-alert.component';
import { OcrViewComponent } from './ocr-view/ocr-view.component';
import { HolisticViewComponent } from './holistic-view/holistic-view.component';
import { ArchivedComponent } from './archived/archived.component';
import { ArchivedViewComponent } from './archived-view/archived-view.component';
import { ArchiveReportComponent } from './archive-report/archive-report.component';
import { DataQualityComponent } from './data-quality/data-quality.component';
import { DataQualityDetailComponent } from './data-quality-detail/data-quality-detail.component';
import { DataQualityReportComponent } from './data-quality-report/data-quality-report.component';
import { OrganisationSetupComponent } from './organisation-setup/organisation-setup.component';
import { HelpComponent } from './help/help.component';
import { NotificationComponent } from './notification/notification.component';
import { BillingComponent } from './billing/billing.component';
import { AccountsComponent } from './accounts/accounts.component';
import { QuestionnaireComponent } from './QuestionnaireComponent/questionnaire.component';
import { QuestionnaireEditorComponent } from './questionnaire-editor/questionnaire-editor.component';
import { QuestionnaireListComponent } from './questionnaire-list/questionnaire-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { QuestionnairePreviewComponent } from './QuestionnairePreviewComponent/questionnaire-preview.component';
import { RolesComponent } from './roles/roles.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { DocumentsComponent } from './documents/documents.component';
import { MembersComponent } from './members/members.component';
import { InsightsComponent } from 'apps/KonaAI2/src/app/insights/insights.component';
import { InsightsComponent as InsightsTemplateComponent } from './insights/insght.component';
import { AlertDashboardComponent } from './alert-dashboard/alert-dashboard.component';


import { TransactionDetailsComponent } from './insights/transaction-view/transaction-details.component';
import { InsightDuplicatecheckComponent } from './insight-duplicatecheck/insight-duplicatecheck.component';
import { InsightsTextAnalysisComponent } from '../insights-text-analysis/insights-text-analysis.component';
import { InsightsTransactionMetricsComponent } from '../insights-transaction-metrics/insights-transaction-metrics.component';
import { InsightsKnowYourVendorComponent } from '../insights-know-your-vendor/insights-know-your-vendor.component';
import { ScenarioManagerComponent } from './scenario-manager/scenario-manager.component';
import { EditScenarioComponent } from './edit-scenario/edit-scenario.component';
import { UnderlyingDetailsComponent } from './insights-visualisations/underlying-details/underlying-details.component';
import { InsightsEntityTransComponent } from './insights/insights-entity-trans/insights-entity-trans.component';
import { AdLoginComponent } from './auth/ad-login/ad-login.component';
import { HomeComponent } from './home/home.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientAdminLayoutComponent } from './page-layout-elements/client-admin-layout/client-admin-layout.component';
import { ClientAdminHomeComponent } from './client-admin-home/client-admin-home.component';
import { ClientConfigurationComponent } from './clientConfiguration/clientConfiguration.component';
import { LicenseComponent } from './License/License.component';
import { WeatherForecastComponent } from './Weather-Forecast/Weather-Forecast.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'ad-auth', component: AdLoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'WeatherForecast', component: WeatherForecastComponent },
  { path: 'ProjectCreation', component: ProjectCreationComponent, canActivate: [AuthGuard] },
  {
    path: 'alert', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: AlertComponent }
    ]
  },
  { path: 'vm-details', component: VmDetailsComponent },
  { path: 'questionnaire', component: QuestionnaireComponent },
  { path: 'create', component: QuestionnaireEditorComponent },
  { path: 'preview', component: QuestionnairePreviewComponent },
    { path: 'projectsDashboard/:id', component: ProjectDashboardComponent },

  { path: 'projectsDashboard', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectDashboardComponent }
    ]
  },
  { path: 'data/:name', component: DataImportComponent },
  { path: 'staging', component: DataStagingComponent },
  { path: 'stagingholistic', component: DataStagingHolisticComponent },
  { path: 'connections', component: ConnectionsComponent },
  { path: 'Mapping', component: DatamappingComponent },
  { path: 'mappingdetails/:submodule', component: MappingdetailsComponent },
  { path: 'holisticView', component: HolisticViewComponent },
  { path: 'archive', component: ArchivedComponent },
  { path: 'archive/view', component: ArchivedViewComponent },
  { path: 'archive/report', component: ArchiveReportComponent },
  { path: 'overview/:projectid', component: OverviewComponent },
  { path: 'data-validations', component: DataValidationComponent },
  { path: 'data-quality', component: DataQualityComponent },
  { path: 'data-quality-detail/:id', component: DataQualityDetailComponent },
  { path: 'data-quality-report/:id', component: DataQualityReportComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'account', component: AccountsComponent },
  //{ path: 'alert-details/:type', component: AlertDetailsComponent },
  { path: 'alert/details/:type', component: TransactionAlertComponent },
  { path: 'ocr-view', component: OcrViewComponent },
  {
    path: 'overview/:projectid', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: OverviewComponent }
    ]
  },
  {
    path: 'ProjectWorkflow/:projectid', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectWorkflowComponent }
    ]
  },
  {
    path: 'projects', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectsComponent }
    ]
  },

  { path: 'alert/details/:type', component: TransactionAlertComponent },
  //{ path: 'ocr-view', component: OcrViewComponent },
  {
    path: 'insights/:ScreenName', component: InsightsComponent,
    children: [
      { path: 'scenario-manager', component: ScenarioManagerComponent },
    ]
  },
  { path: 'edit-scenario/:name', component: EditScenarioComponent },
  {
    path: 'insights', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: InsightsComponent }
    ]
  },
  { path: 'duplicate-check', component: InsightDuplicatecheckComponent },
  { path: 'text-analysis', component: InsightsTextAnalysisComponent },
  { path: 'transaction-metrics', component: InsightsTransactionMetricsComponent },
  { path: 'KnowYourVendor', component: InsightsKnowYourVendorComponent },
  { path: 'createalert', component: CreateAlertComponent, canActivate: [AuthGuard] },
  { path: 'underlying-details', component: UnderlyingDetailsComponent },
  {
    path: 'insights', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: InsightsComponent }
    ]
  },
   
  { path: 'insights-entity-trans', component: InsightsEntityTransComponent, canActivate: [AuthGuard] },
  { path: 'insights/transaction-details', component: TransactionDetailsComponent, canActivate: [AuthGuard] },
  { path: 'view-role/:id', component: ViewRoleComponent, canActivate: [AuthGuard] },
  {path: 'add-role', loadComponent: () => import('./view-role/view-role.component').then(m => m.ViewRoleComponent), title: 'Add New Role',},
  { path: 'organisation-setup', component: OrganisationSetupComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-members', component: ProjectDashboardComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  {
    path: 'admin-projects', component: ClientAdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ProjectDashboardComponent }
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'allclients', component: ClientListComponent, canActivate: [AuthGuard] },
  { path: 'clientdetails/:clientId', component: ClientDetailsComponent, canActivate: [AuthGuard] },
  { path: 'alert-dashboard', component: AlertDashboardComponent, canActivate: [AuthGuard] },
  // Client Admin routes with layout
  {
    path: 'client-admin',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
     
      { path: 'home', component: ClientAdminHomeComponent },
      { path: 'summary', component: OverviewComponent },
      { path: 'configuration', component: OrganisationSetupComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  // Organisation routes with persistent header
  {
    path: 'organisation',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: 'home', component: ClientAdminHomeComponent },
      { path: 'summary', component: ClientDetailsComponent },
      { path: 'setup', component: OrganisationSetupComponent },
      { path: 'members', component: MembersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'questionnaire', component: QuestionnaireListComponent },
      { path: 'insights', component: InsightsTemplateComponent },
      { path: 'configuration', component: ClientConfigurationComponent },
      { path: 'License', component: LicenseComponent },
      { path: 'connector', component: ConnectionsComponent },

      { path: '', redirectTo: 'summary', pathMatch: 'full' }
    ]
  },
  // Projects routes with persistent header
  {
    path: 'projects',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: ClientAdminHomeComponent },
      { path: 'summary', component: OverviewComponent },
      { path: 'list', component: ProjectsComponent },
      { path: 'dashboard', component: ProjectDashboardComponent },
      { path: 'creation', component: ProjectCreationComponent },
      { path: 'workflow/:projectid', component: ProjectWorkflowComponent },
      { path: 'overview/:projectid', component: OverviewComponent },
      { path: 'insights', component: InsightsComponent },
      { path: 'alerts', component: AlertComponent },
      { path: 'members', component: MembersComponent },
      { path: 'roles', component: RolesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  // Additional Client Admin routes that should use the same layout
  {
    path: 'documents',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DocumentsComponent }
    ]
  },
  {
    path: 'questionnaire/list',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: QuestionnaireListComponent }
    ]
  },
  {
    path: 'insight-template',
    component: ClientAdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: InsightsTemplateComponent }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
