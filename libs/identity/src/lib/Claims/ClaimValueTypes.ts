/* eslint-disable @typescript-eslint/member-ordering */
class ClaimValueTypes {
  private XQueryOperatorsNameSpace =
    'http://www.w3.org/TR/2002/WD-xquery-operators-20020816';
  private XmlSignatureConstantsNamespace = 'http://www.w3.org/2000/09/xmldsig#';
  private Xacml10Namespace = 'urn:oasis:names:tc:xacml:1.0';
  private XmlSchemaNamespace = 'http://www.w3.org/2001/XMLSchema';
  private SoapSchemaNamespace = 'http://schemas.xmlsoap.org/';

  public Base64Binary = this.XmlSchemaNamespace + '#base64Binary';
  public Base64Octet = this.XmlSchemaNamespace + '#base64Octet';
  public Boolean = this.XmlSchemaNamespace + '#boolean';
  public Date = this.XmlSchemaNamespace + '#date';
  public DateTime = this.XmlSchemaNamespace + '#dateTime';
  public Double = this.XmlSchemaNamespace + '#double';
  public Fqbn = this.XmlSchemaNamespace + '#fqbn';
  public HexBinary = this.XmlSchemaNamespace + '#hexBinary';
  public Integer = this.XmlSchemaNamespace + '#integer';
  public Integer32 = this.XmlSchemaNamespace + '#integer32';
  public Integer64 = this.XmlSchemaNamespace + '#integer64';
  public Sid = this.XmlSchemaNamespace + '#sid';
  public String = this.XmlSchemaNamespace + '#string';
  public Time = this.XmlSchemaNamespace + '#time';
  public UInteger32 = this.XmlSchemaNamespace + '#uinteger32';
  public UInteger64 = this.XmlSchemaNamespace + '#uinteger64';

  public DnsName = this.SoapSchemaNamespace + 'claims/dns';
  public Email =
    this.SoapSchemaNamespace + 'ws/2005/05/identity/claims/emailaddress';
  public Rsa = this.SoapSchemaNamespace + 'ws/2005/05/identity/claims/rsa';
  public UpnName = this.SoapSchemaNamespace + 'claims/UPN';

  public DsaKeyValue = this.XmlSignatureConstantsNamespace + 'DSAKeyValue';
  public KeyInfo = this.XmlSignatureConstantsNamespace + 'KeyInfo';
  public RsaKeyValue = this.XmlSignatureConstantsNamespace + 'RSAKeyValue';

  public DaytimeDuration = this.XQueryOperatorsNameSpace + '#dayTimeDuration';
  public YearMonthDuration =
    this.XQueryOperatorsNameSpace + '#yearMonthDuration';

  public Rfc822Name = this.Xacml10Namespace + ':data-type:rfc822Name';
  public X500Name = this.Xacml10Namespace + ':data-type:x500Name';
}
