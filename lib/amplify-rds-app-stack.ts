import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AmplifyGraphqlApi,
  AmplifyGraphqlDefinition,
} from "@aws-amplify/graphql-api-construct";
import path = require("path");

export class AmplifyRdsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AmplifyGraphqlApi(this, "SqlBoundApi", {
      apiName: "MySqlBoundApi",
      definition: AmplifyGraphqlDefinition.fromFilesAndStrategy(
        [path.join(__dirname, "schema.graphql")],
        {
          name: "MyBlogSiteDatabase",
          dbType: "MYSQL",
          vpcConfiguration: {
            vpcId: "vpc-249a1859",
            securityGroupIds: ["sg-8c07608f"],
            subnetAvailabilityZoneConfig: [
              {
                subnetId: "subnet-88babcc5",
                availabilityZone: "us-east-1b",
              },
              { subnetId: "subnet-50601636", availabilityZone: "us-east-1d" },
            ],
          },
          dbConnectionConfig: {
            hostnameSsmPath: "/amplify-rds-app/host",
            portSsmPath: "/amplify-rds-app/port",
            usernameSsmPath: "/amplify-rds-app/username",
            passwordSsmPath: "/amplify-rds-app/password",
            databaseNameSsmPath: "/amplify-rds-app/database",
          },
        }
      ),
      authorizationModes: {
        apiKeyConfig: { expires: cdk.Duration.days(7) },
      },
    });
  }
}
