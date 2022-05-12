/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ClaimTypes {
  // FIXME Remove unused claims types
  export const ClaimType2009Namespace =
    'http://schemas.xmlsoap.org/ws/2009/09/identity/claims' as const;
  export const ClaimType2005Namespace =
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims' as const;

  export const ClaimTypeNamespace =
    'http://schemas.microsoft.com/ws/2008/06/identity/claims' as const;

  export const AuthenticationInstant =
    ClaimTypeNamespace + '/authenticationinstant';
  export const AuthenticationMethod =
    ClaimTypeNamespace + '/authenticationmethod';
  export const CookiePath = ClaimTypeNamespace + '/cookiepath';
  export const DenyOnlyPrimarySid = ClaimTypeNamespace + '/denyonlyprimarysid';
  export const DenyOnlyPrimaryGroupSid =
    ClaimTypeNamespace + '/denyonlyprimarygroupsid';
  export const DenyOnlyWindowsDeviceGroup =
    ClaimTypeNamespace + '/denyonlywindowsdevicegroup';
  export const Dsa = ClaimTypeNamespace + '/dsa';
  export const Expiration = ClaimTypeNamespace + '/expiration';
  export const Expired = ClaimTypeNamespace + '/expired';
  export const GroupSid = ClaimTypeNamespace + '/groupsid';
  export const IsPersistent = ClaimTypeNamespace + '/ispersistent';
  export const PrimaryGroupSid = ClaimTypeNamespace + '/primarygroupsid';
  export const PrimarySid = ClaimTypeNamespace + '/primarysid';
  export const Role = ClaimTypeNamespace + '/role';
  export const SerialNumber = ClaimTypeNamespace + '/serialnumber';
  export const UserData = ClaimTypeNamespace + '/userdata';
  export const Version = ClaimTypeNamespace + '/version';
  export const WindowsAccountName = ClaimTypeNamespace + '/windowsaccountname';
  export const WindowsDeviceClaim = ClaimTypeNamespace + '/windowsdeviceclaim';
  export const WindowsDeviceGroup = ClaimTypeNamespace + '/windowsdevicegroup';
  export const WindowsUserClaim = ClaimTypeNamespace + '/windowsuserclaim';
  export const WindowsFqbnVersion = ClaimTypeNamespace + '/windowsfqbnversion';
  export const WindowsSubAuthority =
    ClaimTypeNamespace + '/windowssubauthority';

  export const Anonymous = ClaimType2005Namespace + '/anonymous';
  export const Authentication = ClaimType2005Namespace + '/authentication';
  export const AuthorizationDecision =
    ClaimType2005Namespace + '/authorizationdecision';
  export const Country = ClaimType2005Namespace + '/country';
  export const DateOfBirth = ClaimType2005Namespace + '/dateofbirth';
  export const Dns = ClaimType2005Namespace + '/dns';
  export const DenyOnlySid = ClaimType2005Namespace + '/denyonlysid'; // NOTE: shown as 'Deny only group SID' on the ADFSv2 UI!
  export const Email = ClaimType2005Namespace + '/emailaddress';
  export const Gender = ClaimType2005Namespace + '/gender';
  export const GivenName = ClaimType2005Namespace + '/givenname';
  export const Hash = ClaimType2005Namespace + '/hash';
  export const HomePhone = ClaimType2005Namespace + '/homephone';
  export const Locality = ClaimType2005Namespace + '/locality';
  export const MobilePhone = ClaimType2005Namespace + '/mobilephone';
  export const Name = ClaimType2005Namespace + '/name';
  export const NameIdentifier = ClaimType2005Namespace + '/nameidentifier';
  export const OtherPhone = ClaimType2005Namespace + '/otherphone';
  export const PostalCode = ClaimType2005Namespace + '/postalcode';
  export const Rsa = ClaimType2005Namespace + '/rsa';
  export const Sid = ClaimType2005Namespace + '/sid';
  export const Spn = ClaimType2005Namespace + '/spn';
  export const StateOrProvince = ClaimType2005Namespace + '/stateorprovince';
  export const StreetAddress = ClaimType2005Namespace + '/streetaddress';
  export const Surname = ClaimType2005Namespace + '/surname';
  export const System = ClaimType2005Namespace + '/system';
  export const Thumbprint = ClaimType2005Namespace + '/thumbprint';
  export const Upn = ClaimType2005Namespace + '/upn';
  export const Uri = ClaimType2005Namespace + '/uri';
  export const Webpage = ClaimType2005Namespace + '/webpage';
  export const X500DistinguishedName =
    ClaimType2005Namespace + '/x500distinguishedname';

  export const Actor = ClaimType2009Namespace + '/actor';
}
