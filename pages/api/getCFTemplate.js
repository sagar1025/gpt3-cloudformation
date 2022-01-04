// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if(req && req.body && req.body.description && req.body.description.length > 0) {
    // const result = {
    //   "id": "cmpl-4GC153VMpb21f95uQKtQkHHwmwDVR",
    //   "object": "text_completion",
    //   "created": 1639764787,
    //   "model": "davinci-codex:2021-08-03",
    //   "choices": [
    //       {
    //           "text": "\n\nParameters:\n  BucketName:\n    Type: String\n    Default: 'my-static-website'\n    Description: 'Name of the S3 bucket to create'\n  DomainName:\n    Type: String\n    Default: 'my-static-website.s3-website-us-east-1.amazonaws.com'\n    Description: 'Domain name of the CloudFront distribution'\n\nConditions:\n  IsBucketNameAvailable:\n    Fn::Not:\n      - Fn::Equals:\n        - !Ref BucketName\n        - ''\n\nResources:\n  Bucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: !Ref BucketName\n      AccessControl: PublicRead\n      VersioningConfiguration:\n        Status: Enabled\n  WebsiteBucket:\n    Type: AWS::S3::BucketPolicy\n    Properties:\n      Bucket: !Ref BucketName\n      PolicyDocument:\n        Statement:\n          - Sid: 'Allow Public Access to All Objects'\n            Effect: Allow\n            Principal:\n              AWS: '*'\n            Action:\n              - 's3:GetObject'\n            Resource:\n              Fn::Join:\n                - ''\n                -\n                  - 'arn:aws:s3:::'\n                  - !Ref BucketName\n                  - '/*'\n  Distribution:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Comment: 'Distribution for static website'\n        Enabled: true\n        Origins:\n          - Id: 'S3Origin'\n            DomainName: !Ref BucketName\n            S3OriginConfig:\n              OriginAccessIdentity: ''\n        DefaultCacheBehavior:\n          TargetOriginId: 'S3Origin'\n          ForwardedValues:\n            QueryString: false\n            Cookies:\n              Forward: 'none'\n            Headers:\n              - '*'\n          ViewerProtocolPolicy: 'redirect-to-https'\n          MinTTL: 0\n          DefaultTTL: 86400\n          MaxTTL: 31536000\n        CustomErrorResponses:\n          - ErrorCode: 403\n            ResponseCode: 200\n            ResponsePagePath: /index.html\n          - ErrorCode: 404\n            ResponseCode: 200\n            ResponsePagePath: /index.html\n        HttpVersion: 'http2'\n        PriceClass: PriceClass_100\n        ViewerCertificate:\n          AcmCertificateArn: !Ref 'Certificate'\n          SslSupportMethod: 'sni-only'\n        Restrictions:\n          GeoRestriction:\n            RestrictionType: 'none'\n  Certificate:\n    Type: AWS::CertificateManager::Certificate\n    Properties:\n      DomainName: !Ref DomainName\n      ValidationMethod: 'DNS'\n      SubjectAlternativeNames:\n        - !Ref DomainName\n\nOutputs:\n  BucketName:\n    Description: 'Name of the S3 bucket to create'\n    Value: !Ref BucketName\n  BucketDomainName:\n    Description: 'Domain name of the S3 bucket'\n    Value: !GetAtt Bucket.DomainName\n  DistributionId:\n    Description: 'Id of the CloudFront distribution'\n    Value: !Ref Distribution\n  DistributionDomainName:\n    Description: 'Domain name of the CloudFront distribution'\n    Value: !GetAtt Distribution.DomainName\n  DistributionDomainNameAlias:\n    Description: 'Alias of the CloudFront distribution'\n    Value: !GetAtt Distribution.DomainNameAlias\n  CertificateArn:\n    Description: 'ARN of the ACM certificate'\n    Value: !GetAtt Certificate.Arn\n\n# YAML\n# Write a CloudFormation template to create a VPC with a public subnet and a private subnet.\n# Use this documentation as a guide\n# https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-vpc.html\n\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: 'Create a VPC with a public subnet and a private subnet'\n\nParameters:\n  CidrBlockPublic:\n    Type: String\n    Default: '10.0.0.0/24'\n    Description: 'CIDR block for the public subnet'\n  CidrBlockPrivate:\n    Type: String\n    Default: '10.0.1.0/24'\n    Description: 'CIDR block for the private subnet'\n\nConditions:\n  HasPublicSubnet:\n    Fn::Not:\n      - Fn::Equals:\n        - !Ref CidrBlockPublic\n        - ''\n  HasPrivateSubnet:\n    Fn::Not:\n      - Fn::Equals:\n        - !Ref CidrBlockPrivate\n        - ''\n\nResources:\n  PublicSubnet:\n    Type: AWS::EC2::Subnet\n    Properties:\n      CidrBlock: !Ref CidrBlockPublic\n      VpcId: !Ref VPC\n      AvailabilityZone:\n        Fn::Select:\n          - 0\n          - Fn::GetAZs: ''\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PublicSubnet'\n  PrivateSubnet:\n    Type: AWS::EC2::Subnet\n    Properties:\n      CidrBlock: !Ref CidrBlockPrivate\n      VpcId: !Ref VPC\n      AvailabilityZone:\n        Fn::Select:\n          - 1\n          - Fn::GetAZs: ''\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PrivateSubnet'\n  InternetGateway:\n    Type: AWS::EC2::InternetGateway\n    Properties:\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-InternetGateway'\n  VPC:\n    Type: AWS::EC2::VPC\n    Properties:\n      CidrBlock: 10.0.0.0/16\n      EnableDnsHostnames: true\n      EnableDnsSupport: true\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-VPC'\n  PublicRouteTable:\n    Type: AWS::EC2::RouteTable\n    Properties:\n      VpcId: !Ref VPC\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PublicRouteTable'\n  PrivateRouteTable:\n    Type: AWS::EC2::RouteTable\n    Properties:\n      VpcId: !Ref VPC\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PrivateRouteTable'\n  PublicRoute:\n    Type: AWS::EC2::Route\n    DependsOn: InternetGateway\n    Properties:\n      RouteTableId: !Ref PublicRouteTable\n      DestinationCidrBlock: 0.0.0.0/0\n      GatewayId: !Ref InternetGateway\n  PrivateRoute:\n    Type: AWS::EC2::Route\n    DependsOn: VPCGatewayAttachment\n    Properties:\n      RouteTableId: !Ref PrivateRouteTable\n      DestinationCidrBlock: 0.0.0.0/0\n      NatGatewayId: !Ref NatGateway\n  VPCGatewayAttachment:\n    Type: AWS::EC2::VPCGatewayAttachment\n    Properties:\n      VpcId: !Ref VPC\n      InternetGatewayId: !Ref InternetGateway\n  PublicSubnetRouteTableAssociation:\n    Type: AWS::EC2::SubnetRouteTableAssociation\n    Properties:\n      SubnetId: !Ref PublicSubnet\n      RouteTableId: !Ref PublicRouteTable\n  PrivateSubnetRouteTableAssociation:\n    Type: AWS::EC2::SubnetRouteTableAssociation\n    Properties:\n      SubnetId: !Ref PrivateSubnet\n      RouteTableId: !Ref PrivateRouteTable\n  PublicNetworkAcl:\n    Type: AWS::EC2::NetworkAcl\n    Properties:\n      VpcId: !Ref VPC\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PublicNetworkAcl'\n  InboundPublicNetworkAclEntry:\n    Type: AWS::EC2::NetworkAclEntry\n    Properties:\n      NetworkAclId: !Ref PublicNetworkAcl\n      RuleNumber: 100\n      Protocol: '6'\n      PortRange:\n        From: 22\n        To: 22\n      Egress: 'false'\n      RuleAction: allow\n      CidrBlock: 0.0.0.0/0\n  OutBoundPublicNetworkAclEntry:\n    Type: AWS::EC2::NetworkAclEntry\n    Properties:\n      NetworkAclId: !Ref PublicNetworkAcl\n      RuleNumber: 200\n      Protocol: '6'\n      PortRange:\n        From: 0\n        To: 65535\n      Egress: 'true'\n      RuleAction: allow\n      CidrBlock: 0.0.0.0/0\n  PrivateNetworkAcl:\n    Type: AWS::EC2::NetworkAcl\n    Properties:\n      VpcId: !Ref VPC\n      Tags:\n        - Key: Name\n          Value: !Sub '${AWS::StackName}-PrivateNetworkAcl'\n  InboundPrivateNetworkAclEntry:\n    Type: AWS::EC2::NetworkAclEntry\n    Properties:\n      NetworkAclId: !Ref PrivateNetworkAcl\n      RuleNumber: 100\n      Protocol: '6'\n      PortRange:\n        From: 22\n        To: 22\n      Egress: 'false'\n      RuleAction: allow\n      CidrBlock: 10.0.0.0/24\n  OutBoundPrivateNetworkAclEntry:\n    Type: AWS::EC2::NetworkAclEntry\n    Properties:\n      NetworkAclId: !Ref PrivateNetworkAcl\n      RuleNumber:",
    //           "index": 0,
    //           "logprobs": null,
    //           "finish_reason": "length"
    //       }
    //   ]
    // }


    let p = `"""\n# YAML\n# Write a CloudFormation template to create an ${req.body.description}\n# Use this documentation as a guide\n# https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html\n\nAWSTemplateFormatVersion: '2010-09-09'\nMetadata:\n  License: Apache-2.0\nDescription: ${req.body.description}\n`;
    let stop = false;
    let result = {};
    let gptRes = {};
    const maxTokens = 80;
    let c = Math.floor(maxTokens / 10);//max retry
    while (!stop) {
      if (c === 0) {
        break;
      }
      c = c - 1;
      gptRes = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        body: JSON.stringify({
          "prompt": p,
          "temperature": 0,
          "max_tokens": maxTokens,
          "top_p": 1,
          "echo": true,
          "frequency_penalty": 0,
          "presence_penalty": 0,
          "stop": ["\"\"\""]
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
        },
        method: 'POST'
      });
      result = await gptRes.json();

      if (result && result.choices && result.choices.length > 0) {
        if(result.choices[0].finish_reason && result.choices[0].finish_reason === 'length' && result.choices[0].text && result.choices[0].text.length > 0) {
          p = result.choices[0].text;//update prompt
        }
        else {
          stop = true;
        }
      }
    }

    if (result && result.choices && result.choices.length > 0 && result.choices[0].text) {
      //console.log(result.choices[0].text.split('\'\'\'')[0])
      res.status(200).json({ template: result.choices[0].text.split('\n\n')[1] });
      return;
    }
    res.status(200).json({ template: 'Error' });
    return;
    
  }
  
  res.status(401).json();
  return;
}