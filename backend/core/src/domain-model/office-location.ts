import {assert} from './validation';
import {AttributeMap} from './common';

type OfficeLocationMap = { [region: string]: { [country: string]: string[] } };

export class OfficeLocation {
  static readonly officeLocationMap: OfficeLocationMap = {
    Africa: {'Morocco': ['Casablanca'], 'South Africa': ['South Africa (Claremont)']},
    Americas: {
      'Argentina': ['Buenos Aires'],
      'Brazil': ['Alphaville', 'Belo Horizonte', 'Blumenau', 'Brasília', 'Campinas', 'Curitiba', 'Porto Alegre', 'Rio de Janeiro', 'Salvador'],
      'Canada': ['Calgary', 'Halifax', 'Markham', 'Mississauga (1660 Tech Avenue)', 'Mississauga (2425 Matheson Blvd East Suite 401)', 'Montreal', 'Toronto (200 University Avenue, Suite 1100)', 'Toronto (5639 Finch Avenue East)', 'Toronto (800 Kipling Avenue Unit 8)'],
      'Chile': ['Santiago'],
      'Colombia': ['Bogotá', 'Medellín'],
      'Guatemala': ['Guatemala'],
      'Mexico': ['Aguascalientes', 'Ciudad de México'],
      'United States': ['Alpharetta', 'Ann Arbor', 'Atlanta', 'Austin (600 Center Ridge Drive)', 'Austin (713 E. 6th Street)', 'Austin (10900 Stonelake Blvd.)',
        'Bellevue', 'Bloomfield', 'Bridgewater (100 Somerset Corporate Blvd.)', 'Bridgewater (200 Somerset Corporate Blvd.)', 'Burbank', 'Charlotte', 'Chicago', 'Cincinnati',
        'Columbia', 'El Paso', 'Foxborough', 'Greenwood Village', 'Guaynabo', 'Horsham', 'Houston (5051 Westheimer Road)', 'Houston (1221 Lamar)',
        'Indianapolis', 'Irving (201 E. John Carpenter Freeway)', 'Irving (222 W Las Colinas Blvd.)', 'Kansas City', 'Lenexa', 'Lisle', 'Manchester', 'Miamisburg', 'New York ()', 'New York ()',
        'Omaha', 'Pensacola', 'Philadelphia', 'Plano', 'Redmond', 'Richfield', 'Rockford', 'Rosemont', 'San Diego',
        'San Francisco ()', 'San Francisco ()', 'Scottsdale', 'Southfield', 'Tampa', 'Timonium', 'Tysons', 'University Park', 'Wayne',
        'West Chester', 'West Des Moines', 'West Springfield', 'Westchester', 'Westerville', 'Wilmington']
    },
    'Asia Pacific': {
      'Australia': ['Adelaide', 'Brisbane', 'Canberra', 'Melbourne', 'Sydney'],
      'China': ['Hong Kong', 'Foshan', 'Kunshan', 'Shanghai', 'Beijing', 'Guangzhou', 'Taiwan (Taipei)'],
      'India': ['Bengaluru', 'Bhubaneswar', 'Chennai', 'Gandhinagar', 'Gurugram', 'Hyderabad', 'Kolkata', 'Mumbai',
        'Noida', 'Pune', 'Salem', 'Trichy'],
      'Japan': ['Tokyo (6-1-11 Shimbashi, Minato-ku)', 'Tokyo (1-9-5 Otemachi Chiyoda-ku)'],
      'New Zealand': ['Auckland', 'Wellington'],
      'Philippines': ['Manila'],
      'Singapore': ['Singapore (12 Marina Boulevard)'],
      'Vietnam': ['Ho Chi Minh City']
    },
    Europe: {
      'Austria': ['Vienna'],
      'Belgium': ['Brussels'],
      'Czech Republic': ['Brno', 'Ostrava', 'Praha'],
      'Denmark': ['Aarhus', 'Vallensbæk'],
      'Finland': ['Espoo', 'Helsinki', 'Lappeenranta'],
      'France': ['Aix-en-Provence', 'Bayonne', 'Belfort', 'Bordeaux', 'Brest', 'Cherbourg (Equeurdreville)', 'Cherbourg (Cherbourg – Octeville)',
        'Clermont', 'Gouvieux', 'Grenoble', 'Lille', 'Lyon', 'Montpellier', 'Nancy', 'Nantes (16 Mail Pablo Picasso)', 'Nantes (6 rue Nathalie Lemele)',
        'Nice-Sophia Antipolis', 'Orléans', 'Paris (76 avenue Kléber)', 'Paris (8, rue Cambacérès)', 'Paris (11 rue de Tilsitt)', 'Paris (Issy-les-Moulineaux)',
        'Pau', 'Rennes', 'Ruoms', 'Strasbourg', 'Toulouse', 'Tours'],
      'Germany': ['Berlin', 'Dortmund', 'Düsseldorf', 'Erfurt', 'Frankfurt', 'Hamburg', 'Hannover', 'Köln', 'Lahr',
        'Lübeck', 'München', 'Nürnberg', 'Stuttgart'],
      'Hungary': ['Budapest'],
      'Italy': ['Bergamo', 'Bologna', 'Genova', 'La Spezia', 'Milano', 'Napoli', 'Piacenza', 'Roma', 'Torino', 'Venezia'],
      'Luxembourg': ['Luxembourg (61 Avenue de la gare)', 'Bertrange'],
      'Netherlands': ['Utrecht', 'Vianen'],
      'Norway': ['Bergen', 'Fredrikstad', 'Lillehammer', 'Oslo', 'Stavanger', 'Trondheim'],
      'Poland': ['Katowice', 'Kraków', 'Lublin', 'Opole', 'Poznań', 'Warszawa', 'Wrocław'],
      'Portugal': ['Lisboa'],
      'Romania': ['Bucharest', 'Iasi', 'Suceava'],
      'Spain': ['Asturias', 'Barcelona', 'Madrid', 'Getafe', 'Murcia', 'Valencia'],
      'Sweden': ['Solna', 'Göteborg', 'Malmö', 'Stockholm', 'Älmhult', 'Växjö'],
      'Switzerland': ['Genève', 'Zürich'],
      'United Kingdom': ['Birmingham', 'Bristol', 'Glasgow', 'Inverness', 'Liverpool', 'London', 'Manchester', 'Nairn',
        'Rotherham', 'Sheffield', 'Telford', 'Treforest, Wales', 'Woking']
    },
    'Middle East': {'Saudi Arabia': ['Riyadh'], 'United Arab Emirates': ['Abu Dhabi', 'Dubai']}
  };

  static readonly regions = Object.keys(OfficeLocation.officeLocationMap);
  static readonly attributeName = 'officeLocation';

  static parse(officeLocationAttributes: AttributeMap): OfficeLocation {
    const regionValue = officeLocationAttributes[Region.attributeName];
    const region = Region.parse(regionValue, OfficeLocation.regions);

    const countryValue = officeLocationAttributes[Country.attributeName];
    const regionCountryMap = OfficeLocation.officeLocationMap[region.value];
    const allowedCountries = Object.keys(regionCountryMap);
    const country = Country.parse(countryValue, allowedCountries);

    const officeValue = officeLocationAttributes[Office.attributeName];
    const allowedOffices = regionCountryMap[country.value];
    const office = Office.parse(officeValue, allowedOffices);

    return new OfficeLocation(region, country, office);
  }

  private constructor(public readonly region: Region, public readonly country: Country, public readonly office: Office) {
  }

  toPlainAttributes(): AttributeMap {
    const attributeMap: AttributeMap = {};
    attributeMap[Region.attributeName] = this.region.value;
    attributeMap[Country.attributeName] = this.country.value;
    attributeMap[Office.attributeName] = this.office.value;

    return attributeMap;
  }
}

export class Region {
  static readonly attributeName = 'region';

  static parse(value: string, allowedValues: string[]): Region {
    assert(Region.attributeName).of(value)
      .isNotEmpty()
      .isOneOf(allowedValues);

    return new Region(value);
  }

  private constructor(public readonly value: string) {
  }
}

export class Country {
  static readonly attributeName = 'country';

  static parse(value: string, allowedValues: string[]): Region {
    assert(Country.attributeName).of(value)
      .isNotEmpty()
      .isOneOf(allowedValues);

    return new Country(value);
  }

  private constructor(public readonly value: string) {
  }
}

export class Office {
  static readonly attributeName = 'office';

  static parse(value: string, allowedValues: string[]): Region {
    assert(Office.attributeName).of(value)
      .isNotEmpty()
      .isOneOf(allowedValues);

    return new Office(value);
  }

  private constructor(public readonly value: string) {
  }
}
