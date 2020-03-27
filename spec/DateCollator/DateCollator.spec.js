const {DateCollator} = require( '../../index' );
// import (DateCollator) from '../../index';
describe( `DateCollator`, function()
{
	const date2020$03$23T09$00 = new Date( 2020, 2, 23, 9, 0 );
	const date2020$03$23T11$00 = new Date( 2020, 2, 23, 11, 0 );
	const date2020$03$23T17$00 = new Date( 2020, 2, 23, 17, 0 );
	const date2026$03$23T11$00 = new Date( 2026, 2, 23, 11, 0 );
	const anyValidDate = date2020$03$23T17$00;
	const invalidDate = new Date( NaN );
	describe( `Constructor usage`, function()
	{
		describe( `Calling the constructor without 'new'`, function()
		{
			it( `should throw an exception`, async function()
			{
				expect( function()
				{
					const _dateCollator = DateCollator();
				})
				.toThrowError();
			});
		});
		describe( `Specifying an invalid 'dateSensitivity' type`, function()
		{
			it( `should throw an exception`, async function()
			{
				expect( function()
				{
					// The similar valid option is 'fractionalSecond'.
					const _dateCollator = new DateCollator( null, {dateSensitivity:'year'});
				})
				.toThrowError();
			});
		});
		describe( `Specifying an invalid 'dateSensitivity' value`, function()
		{
			it( `should throw an exception`, async function()
			{
				expect( function()
				{
					// The similar valid option is 'fractionalSecond'.
					const _dateCollator = new DateCollator( null, {dateSensitivity:['millisecond']});
				})
				.toThrowError();
			});
		});
		describe( `Specifying an invalid 'dateUsage' type/value`, function()
		{
			it( `should throw an exception`, async function()
			{
				expect( function()
				{
					// The similar valid option is 'utc'.
					const _dateCollator = new DateCollator( null, {dateUsage:'gmt'});
				})
				.toThrowError();
			});
		});
	});
	describe( `Instance usage`, function()
	{
		describe( `Instance usage, example default`, function()
		{
			it( `should be able to compare Dates to the fractional second with default options`, async function()
			{
				const dateCollator = new DateCollator();
				expect(
					dateCollator.compare( date2020$03$23T09$00, new Date( date2020$03$23T09$00.getTime()))
				)
				.toEqual( 0 );
			});
		});
		describe( `Instance usage, example 'utc' date only`, function()
		{
			it( `should be able to check whether Dates occur during the same day, UTC`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['year', 'month', 'day'], dateUsage:'utc'});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2020$03$23T17$00 )
				)
				.toEqual( 0 );
			});
		});
		describe( `Instance usage, example 'utc' time only`, function()
		{
			it( `should be able to check whether Dates occur during the same day, UTC`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['hour', 'minute', 'second', 'fractionalSecond'], dateUsage:'utc'});
				expect(
					dateCollator.compare( date2020$03$23T11$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
		});
		describe( `Instance usage, example 'dayPeriod'`, function()
		{
			it( `should be able to check whether Dates occur during the same ('local') 'dayPeriod' (meridian) of any day`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['dayPeriod']});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
			it( `should be able to check whether Dates occur during the same 'utc' 'dayPeriod' (meridian) of any day`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['dayPeriod'], dateUsage:'utc'});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
		});
		describe( `Instance usage, example 'weekday'`, function()
		{
			it( `should be able to check whether Dates occur during the same ('local') 'weekday' of any week`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['weekday']});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
			it( `should be able to check whether Dates occur during the same 'utc' 'weekday' of any week`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['weekday'], dateUsage:'utc'});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
		});
		describe( `Instance usage, example 'era'`, function()
		{
			it( `should be able to check whether Dates occur during the same ('local') 'era' of any week`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['era']});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
			it( `should be able to check whether Dates occur during the same 'utc' 'era' of any week`, async function()
			{
				const dateCollator = new DateCollator( null, {dateSensitivity:['era'], dateUsage:'utc'});
				expect(
					dateCollator.compare( date2020$03$23T09$00, date2026$03$23T11$00 )
				)
				.toEqual( 0 );
			});
		});
		describe( `Member usage, reference to 'compare'`, function()
		{
			it( `should be able to sort Dates using 'Array.prototype.sort'`, async function()
			{
				const dateCollator = new DateCollator();
				// Not in chronological order.
				let dates =
				[
					date2020$03$23T17$00,
					date2020$03$23T11$00,
					date2020$03$23T09$00,
					date2026$03$23T11$00,
				];
				// Sorted in random order.
				class RandomCollator
				{
					get compare()
					{
						function compareUnbound( _left, _right )
						{return( Math.floor( Math.random() * 3 ) - 1 );}
						return( compareUnbound.bind( this ));
					}
				};
				const randomCollator = new RandomCollator();
				dates.sort( randomCollator.compare );
				// Sort in chronological order.
				expect(
					dates.sort( dateCollator.compare )
				)
				.toEqual(
				[
					date2020$03$23T09$00,
					date2020$03$23T11$00,
					date2020$03$23T17$00,
					date2026$03$23T11$00,
				]);
			});
		});
	});
	describe( `Member usage, 'compare' return value consistency`, function()
	{
		const defaultCollator = new DateCollator();
		describe( `Comparisons returning a value less than zero`, function()
		{
			describe( `A (valid) Date to 'null'`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( anyValidDate, null )).toBeLessThan( 0 );
				});
			});
			describe( `A (valid) Date to 'undefined'`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( anyValidDate, undefined )).toBeLessThan( 0 );
				});
			});
			describe( `An invalid Date to a (valid) Date`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( invalidDate, anyValidDate )).toBeLessThan( 0 );
				});
			});
			describe( `An invalid Date to 'null'`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( invalidDate, null )).toBeLessThan( 0 );
				});
			});
			describe( `An invalid Date to 'undefined'`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( invalidDate, undefined )).toBeLessThan( 0 );
				});
			});
			describe( `'null' to 'undefined'`, function()
			{
				it( `should be less than 0`, async function()
				{
					expect( defaultCollator.compare( null, undefined )).toBeLessThan( 0 );
				});
			});
		});
		describe( `Comparisons returning zero`, function()
		{
			describe( `Nothing to nothing (no arguments)`, function()
			{
				it( `should be equal to 0`, async function()
				{
					expect( defaultCollator.compare()).toEqual( 0 );
				});
			});
			describe( `'null' to 'null'`, function()
			{
				it( `should be equal to 0`, async function()
				{
					expect( defaultCollator.compare( null, null )).toEqual( 0 );
				});
			});
			describe( `'undefined' to 'undefined'`, function()
			{
				it( `should be equal to 0`, async function()
				{
					expect( defaultCollator.compare( undefined, undefined )).toEqual( 0 );
				});
			});
			describe( `A (valid) Date to itself`, function()
			{
				it( `should be equal to 0`, async function()
				{
					expect( defaultCollator.compare( anyValidDate, anyValidDate )).toEqual( 0 );
				});
			});
			describe( `An invalid Date to itself`, function()
			{
				it( `should be equal to 0`, async function()
				{
					expect( defaultCollator.compare( invalidDate, invalidDate )).toEqual( 0 );
				});
			});
		});
		describe( `Comparisons returning a value greater than zero`, function()
		{
			describe( `'null' to a (valid) Date`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( null, anyValidDate )).toBeGreaterThan( 0 );
				});
			});
			describe( `'undefined' to a (valid) Date`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( undefined, anyValidDate )).toBeGreaterThan( 0 );
				});
			});
			describe( `A (valid) Date to an invalid Date`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( anyValidDate, invalidDate )).toBeGreaterThan( 0 );
				});
			});
			describe( `'null' to an invalid Date`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( null, invalidDate )).toBeGreaterThan( 0 );
				});
			});
			describe( `'undefined' to an invalid Date`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( undefined, invalidDate )).toBeGreaterThan( 0 );
				});
			});
			describe( `'undefined' to 'null'`, function()
			{
				it( `should be greater than 0`, async function()
				{
					expect( defaultCollator.compare( undefined, null )).toBeGreaterThan( 0 );
				});
			});
		});
	});
});