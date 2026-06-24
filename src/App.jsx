import React, { useEffect, useMemo, useState } from 'react';
import launchChecklist from './data/launchChecklist.json';
import churchSuite from './data/churchSuite.json';
import aiStudyPro from './data/aiStudyPro.json';
import bibleMapsTimeline from './data/bibleMapsTimeline.json';
import academySchools from './data/academySchools.json';
import devotions360 from './data/devotions360.json';
import quizMcqBank from './data/quizMcqBank.json';
import quizFlashcards from './data/quizFlashcards.json';
import memoryVerses from './data/memoryVerses.json';
import bibleQuizzes from './data/bibleQuizzes.json';
import missionsData from './data/missions.json';
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Search, BookOpen, Bookmark, BookmarkCheck, Share2, Volume2, Sparkles, CalendarDays, Home, Grid3X3, User, ChevronRight, Copy, LogIn, LogOut, Download, ShieldCheck, Menu, ArrowLeft, Database, BrainCircuit, Moon, Sun, ExternalLink, AlertCircle, Sunrise, Library, ListChecks, Bell, PenLine, Trash2, CheckCircle2, HeartHandshake, Flame, Trophy, Clock, Star, Filter, BarChart3, History, MessageSquare, Activity, TrendingUp, Users, Megaphone, MessageCircle, Globe2, Send, Map, MessageSquareHeart, Footprints, BookMarked, Smartphone, BadgeCheck, Store, Rocket, Palette, Bug, Image, Heart, Brain, GraduationCap, XCircle, Shuffle, AlarmClock, HelpCircle, RefreshCcw, CreditCard, Award, BellRing, BookOpenCheck, MapPinned, Clock3, UsersRound, Landmark, Bot, WandSparkles, MessagesSquare, FileText, ClipboardList, Lightbulb, Church, UserCheck, CalendarCheck, HandHeart, ClipboardCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import topics from './data/topics.json';
import verses from './data/verses.json';
import plans from './data/plans.json';
import bibleBooks from './data/bibleBooks.json';
import devotions from './data/devotions.json';
import devotionalLibrary from './data/devotionalLibrary.json';
import groupPlans from './data/groupPlans.json';
import discussionGuides from './data/discussionGuides.json';
import communityPrompts from './data/communityPrompts.json';
import { supabase, supabaseEnabled } from './lib/supabase.js';
import { speak, shareVerse, copyText } from './lib/actions.js';
import { searchTopics, searchVerses } from './lib/search.js';

const cls = (...a) => a.filter(Boolean).join(' ');

function useLocal(key, init) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init; } catch { return init; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000) || 1;
}


function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
function calcStreak(completedDays = []) {
  const unique = [...new Set(completedDays)].sort((a, b) => a - b);
  if (!unique.length) return { current: 0, longest: 0 };
  let longest = 1, run = 1;
  for (let i = 1; i < unique.length; i++) {
    run = unique[i] === unique[i - 1] + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const today = dayOfYear();
  const yesterday = today - 1;
  let current = 0;
  let cursor = unique.includes(today) ? today : unique.includes(yesterday) ? yesterday : null;
  while (cursor && unique.includes(cursor)) { current++; cursor--; }
  return { current, longest };
}
const prayerCategories = ['Family', 'Health', 'Marriage', 'Children', 'Career', 'Finances', 'Direction', 'Ministry', 'Deliverance', 'Thanksgiving', 'Academic Success', 'Business'];
const prayerStatuses = ['Waiting', 'Ongoing', 'Answered'];

const familyCollections = [
  {
    id: 'singles', title: 'Singles Devotions', icon: '👤', color: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    description: 'Purpose, purity, waiting well, identity in Christ, and relationships guided by Scripture.',
    plan: '14-day Singles with Purpose plan', declaration: 'I am complete in Christ, guided by wisdom, and fruitful in my season.',
    devotions: [
      { title: 'Whole in Christ Before a Relationship', reference: 'Colossians 2:10', story: 'Ruth’s faithfulness before Boaz reminds us that character precedes covenant opportunity.', message: 'Singleness is not emptiness; it is a season where identity is built in Christ rather than borrowed from another person.', prayer: 'Lord, establish my identity in You and prepare me for every assignment and relationship in Your timing.' },
      { title: 'Waiting Without Losing Purpose', reference: 'Psalm 27:14', story: 'David was anointed long before he sat on the throne, yet he learned patience in hidden places.', message: 'Waiting seasons are not wasted when they are surrendered to God. He uses them to build maturity, discipline, and faith.', prayer: 'Father, strengthen my heart while I wait and keep me faithful in my present season.' },
      { title: 'Purity With Joy', reference: '1 Corinthians 6:19-20', story: 'Joseph fled temptation because he valued God’s presence more than temporary pleasure.', message: 'Purity is not merely restriction; it is worship with the body, mind, and desires.', prayer: 'Lord, give me grace to honor You with my choices, relationships, thoughts, and body.' }
    ]
  },
  {
    id: 'couples', title: 'Couples Devotions', icon: '❤️', color: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
    description: 'Communication, forgiveness, unity, prayer, sacrificial love, and spiritual growth together.',
    plan: '21-day Growing Together plan', declaration: 'We grow in love, patience, unity, and prayer by the grace of God.',
    devotions: [
      { title: 'Speaking With Grace', reference: 'Ephesians 4:29', story: 'Aquila and Priscilla served together and helped teach Apollos with wisdom and humility.', message: 'Healthy communication builds, heals, and clarifies. Love does not weaponize words; it uses words to give grace.', prayer: 'Father, teach us to speak with patience, truth, gentleness, and honor.' },
      { title: 'Forgiveness That Protects Love', reference: 'Colossians 3:13', story: 'Hosea’s costly love gives a picture of mercy that keeps pursuing restoration.', message: 'Every relationship will need forgiveness. Grace does not ignore wrong, but it refuses to let bitterness become lord.', prayer: 'Lord, help us forgive quickly, repent sincerely, and rebuild trust wisely.' },
      { title: 'Praying as One', reference: 'Matthew 18:19', story: 'The early church grew in power as believers continued together in prayer.', message: 'Couples grow stronger when prayer becomes a shared rhythm, not an emergency tool.', prayer: 'Lord, make our relationship a place of prayer, agreement, and spiritual strength.' }
    ]
  },
  {
    id: 'marriage', title: 'Marriage Devotions', icon: '💍', color: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    description: 'Covenant love, conflict resolution, finances, intimacy, parenting, and building a godly home.',
    plan: '30-day Marriage Strengthening plan', declaration: 'Our home is built on Christ, covenant love, forgiveness, and wisdom.',
    devotions: [
      { title: 'Covenant Before Convenience', reference: 'Genesis 2:24', story: 'Adam and Eve’s union establishes marriage as covenant, companionship, and shared stewardship before God.', message: 'Marriage thrives when husband and wife remember that covenant is deeper than convenience, emotion, or pressure.', prayer: 'Father, strengthen our covenant and teach us to serve one another with love.' },
      { title: 'Resolving Conflict With Humility', reference: 'James 1:19', story: 'Abigail’s wisdom turned away anger and protected her household from destruction.', message: 'Many conflicts are healed when listening increases, anger slows, and humility leads the conversation.', prayer: 'Lord, give us soft hearts, listening ears, and wisdom in disagreement.' },
      { title: 'Stewarding Money Together', reference: 'Proverbs 21:5', story: 'Joseph’s planning during years of plenty preserved nations during famine.', message: 'Financial unity requires honesty, planning, generosity, and trust. Stewardship is a spiritual discipline.', prayer: 'Father, teach our home diligence, contentment, generosity, and wise planning.' }
    ]
  },
  {
    id: 'parenting', title: 'Parenting Devotions', icon: '👨‍👩‍👧', color: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
    description: 'Training children, discipline with love, family prayer, example, wisdom, and spiritual leadership.',
    plan: '30-day Parenting with Wisdom plan', declaration: 'God gives me wisdom to lead, love, correct, and bless my children.',
    devotions: [
      { title: 'Teaching the Way of the Lord', reference: 'Proverbs 22:6', story: 'Hannah dedicated Samuel to the Lord and released him into God’s purpose.', message: 'Parenting is discipleship at home. Children learn faith through instruction, example, correction, and prayer.', prayer: 'Lord, help me teach, model, and nurture faith with love and consistency.' },
      { title: 'Discipline With Love', reference: 'Hebrews 12:11', story: 'God’s correction is never careless; it is purposeful, loving, and aimed at maturity.', message: 'Discipline should form character, not crush the spirit. Love gives boundaries with patience and wisdom.', prayer: 'Father, teach me to correct with wisdom, patience, and love.' },
      { title: 'Leading by Example', reference: 'Deuteronomy 6:6-7', story: 'Timothy’s sincere faith was nurtured through the influence of his mother and grandmother.', message: 'Children remember lived faith. The home becomes a classroom when love, prayer, worship, and integrity are visible.', prayer: 'Lord, let my life preach Your goodness in my home.' }
    ]
  },
  {
    id: 'children', title: 'Children’s Devotions', icon: '🧒', color: 'from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30',
    description: 'Simple Bible stories, memory verses, prayers, obedience, kindness, courage, and God’s love.',
    plan: '14-day Children’s Bible Stories plan', declaration: 'I am loved by God, helped by God, and growing in wisdom every day.',
    devotions: [
      { title: 'God Made Me Special', reference: 'Psalm 139:14', story: 'David praised God because he knew God made him wonderfully.', message: 'Children can learn early that their worth comes from God, not comparison or approval.', prayer: 'Dear God, thank You for making me special and loving me always.' },
      { title: 'Courage Like David', reference: '1 Samuel 17:45', story: 'David faced Goliath because he trusted the Lord more than he feared the giant.', message: 'God helps children be brave when they face hard things at school, home, or among friends.', prayer: 'Lord, help me be brave and trust You today.' },
      { title: 'Kindness Like Jesus', reference: 'Ephesians 4:32', story: 'Jesus welcomed children and showed kindness to people others ignored.', message: 'Kindness is one way children can show the love of Jesus every day.', prayer: 'Jesus, help me be kind with my words and actions.' }
    ]
  },
  {
    id: 'youth', title: 'Youth Devotions', icon: '🎓', color: 'from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30',
    description: 'Purpose, peer pressure, social media wisdom, purity, school, courage, identity, and calling.',
    plan: '21-day Youth with Purpose plan', declaration: 'I will remember my Creator, walk in wisdom, and live boldly for Christ.',
    devotions: [
      { title: 'Remember God While Young', reference: 'Ecclesiastes 12:1', story: 'Daniel chose faithfulness as a young man in Babylon and God distinguished him.', message: 'Youth is not too early for purpose. God can use young people who choose conviction over compromise.', prayer: 'Lord, help me honor You with my youth, choices, friendships, and future.' },
      { title: 'Standing Under Pressure', reference: 'Romans 12:2', story: 'Shadrach, Meshach, and Abednego refused to bow even when everyone else did.', message: 'Peer pressure loses power when identity is rooted in God’s Word and courage is strengthened by conviction.', prayer: 'Father, give me courage to stand for what pleases You.' },
      { title: 'Wisdom Online', reference: 'Philippians 4:8', story: 'The eye is a gate to the heart; Scripture teaches believers to guard what shapes their thoughts.', message: 'Social media can influence desires, identity, and peace. Wisdom asks whether content is shaping the soul toward Christ.', prayer: 'Lord, guide my online choices and guard my heart.' }
    ]
  }
];


const specialCollections = [
  { id: 'healing', title: 'Healing Collection', icon: '🩺', color: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30', description: 'Healing by faith, restoration, strength in weakness, and trusting God through illness.', declaration: 'The Lord restores, strengthens, comforts, and upholds me.', items: [
    { title: 'Healing by Faith', reference: 'Jeremiah 30:17', story: 'The woman with the issue of blood pressed through the crowd to touch Jesus, believing that His power could make her whole.', message: 'Healing begins with bringing weakness honestly before God. Even when the process is gradual, faith keeps reaching for Christ and resting in His compassion.', prayer: 'Lord, restore health, renew strength, and help me trust You through every season of healing.' },
    { title: 'Strength in Weakness', reference: '2 Corinthians 12:9', story: 'Paul learned that God’s grace could be sufficient even when a burden remained.', message: 'God does not abandon His people in weakness. His strength is often most visible where human strength ends.', prayer: 'Father, let Your grace be sufficient and Your strength be made perfect in me.' },
    { title: 'The Compassion of Christ', reference: 'Matthew 14:14', story: 'Jesus saw the crowds and was moved with compassion, healing their sick.', message: 'The heart of Christ is not cold toward suffering. He sees pain, cares deeply, and ministers with mercy.', prayer: 'Jesus, let Your compassion touch every wounded place in my life.' }
  ]},
  { id: 'anxiety-peace', title: 'Anxiety & Peace Collection', icon: '🕊️', color: 'from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30', description: 'God’s peace, overcoming fear, casting burdens, and resting in His presence.', declaration: 'The peace of God guards my heart and mind in Christ Jesus.', items: [
    { title: 'Casting Your Burdens', reference: '1 Peter 5:7', story: 'Hannah poured out her anxiety before the Lord and rose with a changed countenance.', message: 'Prayer does not deny anxiety; it transfers the weight from anxious hands to a faithful Father.', prayer: 'Father, I cast every care on You and receive Your peace today.' },
    { title: 'Perfect Peace', reference: 'Isaiah 26:3', story: 'Israel learned that stability came from trusting the Lord rather than circumstances.', message: 'Peace grows where the mind is stayed on God. What fills the mind eventually shapes the heart.', prayer: 'Lord, keep my mind fixed on You and my heart steady in Your peace.' },
    { title: 'Fear Not', reference: 'Isaiah 41:10', story: 'God repeatedly told His people not to fear because His presence was with them.', message: 'The answer to fear is not self-confidence but God-confidence. He strengthens, helps, and upholds His people.', prayer: 'Lord, replace fear with faith in Your presence and power.' }
  ]},
  { id: 'prayer', title: 'Prayer Collection', icon: '🙏', color: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30', description: 'Power of prayer, persistence, intercession, waiting, and faith-filled communion with God.', declaration: 'My prayers rise before God, and I trust His wisdom and timing.', items: [
    { title: 'Ask, Seek, Knock', reference: 'Matthew 7:7', story: 'Jesus taught His disciples to approach the Father with confidence and persistence.', message: 'Prayer is an invitation into relationship. God calls His children to ask, seek, and knock with trust.', prayer: 'Father, teach me to pray with faith, persistence, and surrender.' },
    { title: 'Persistent Prayer', reference: 'Luke 18:1', story: 'Jesus told the parable of the persistent widow so people would pray and not faint.', message: 'Delay is not denial. Persistent prayer keeps hope alive while God works in ways we cannot yet see.', prayer: 'Lord, strengthen me to keep praying without losing heart.' },
    { title: 'Intercession', reference: '1 Timothy 2:1', story: 'Moses stood in the gap for Israel, pleading for mercy when the people failed.', message: 'Intercession is love expressed in prayer. God uses praying people to carry others before His throne.', prayer: 'Lord, make me faithful in prayer for others.' }
  ]},
  { id: 'leadership', title: 'Leadership Collection', icon: '👑', color: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30', description: 'Servant leadership, wisdom, humility, integrity, courage, and vision.', declaration: 'I lead with humility, wisdom, courage, and a servant’s heart.', items: [
    { title: 'Servant Leadership', reference: 'Mark 10:45', story: 'Jesus washed feet and taught that greatness in the kingdom is expressed through service.', message: 'Christian leadership is not domination; it is sacrificial service shaped by love and humility.', prayer: 'Lord, give me a servant heart and wisdom to lead well.' },
    { title: 'Integrity in Leadership', reference: 'Proverbs 11:3', story: 'Daniel served in government with excellence and integrity even under pressure.', message: 'Integrity protects leadership from collapse. What is hidden eventually shapes what is public.', prayer: 'Father, make my private life faithful and my leadership trustworthy.' },
    { title: 'Leading With Courage', reference: 'Joshua 1:9', story: 'Joshua stepped into leadership after Moses and received God’s command to be strong and courageous.', message: 'Godly leadership requires courage rooted in God’s presence, not personality alone.', prayer: 'Lord, help me lead with courage because You are with me.' }
  ]},
  { id: 'financial-breakthrough', title: 'Financial Breakthrough Collection', icon: '🌾', color: 'from-lime-50 to-emerald-50 dark:from-lime-950/30 dark:to-emerald-950/30', description: 'Provision, stewardship, contentment, generosity, work, and trusting God financially.', declaration: 'God supplies my needs and teaches me wise stewardship.', items: [
    { title: 'God Supplies', reference: 'Philippians 4:19', story: 'Paul thanked the Philippians for generosity and reminded them that God supplies according to His riches.', message: 'Provision is not merely about money; it is confidence that God sees needs and sustains His people.', prayer: 'Father, supply my needs and teach me contentment, diligence, and generosity.' },
    { title: 'Faithful Stewardship', reference: 'Proverbs 21:5', story: 'Joseph’s planning preserved Egypt and surrounding nations during famine.', message: 'Financial breakthrough often includes wisdom, planning, work, restraint, and obedience.', prayer: 'Lord, give me wisdom to manage resources faithfully.' },
    { title: 'Generosity Opens the Heart', reference: 'Luke 6:38', story: 'The widow gave what she had, and Jesus honored the heart behind the gift.', message: 'Generosity frees the heart from fear and reflects trust in God’s provision.', prayer: 'Lord, make me generous, wise, and free from fear.' }
  ]},
  { id: 'spiritual-warfare', title: 'Spiritual Warfare Collection', icon: '⚔️', color: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30', description: 'Armor of God, standing firm, victory in Christ, resisting temptation, and spiritual authority.', declaration: 'I stand firm in Christ and walk in His victory.', items: [
    { title: 'The Armor of God', reference: 'Ephesians 6:11', story: 'Paul described the believer’s spiritual armor while writing to Christians facing unseen battles.', message: 'Spiritual warfare requires truth, righteousness, faith, salvation, the Word, and prayer.', prayer: 'Lord, clothe me with Your armor and keep me steadfast.' },
    { title: 'Victory in Christ', reference: 'Romans 8:37', story: 'The early church endured persecution yet held to Christ’s triumph.', message: 'Victory does not mean absence of struggle; it means Christ’s love makes us more than conquerors in struggle.', prayer: 'Jesus, help me live from Your victory, not from fear.' },
    { title: 'Resisting Temptation', reference: 'James 4:7', story: 'Jesus resisted temptation in the wilderness by submitting to the Father and speaking Scripture.', message: 'Temptation is resisted through submission to God, truth, prayer, and wise boundaries.', prayer: 'Lord, strengthen me to resist temptation and draw near to You.' }
  ]},
  { id: 'hope', title: 'Hope Collection', icon: '🌈', color: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30', description: 'Hope during trials, God’s promises, endurance, encouragement, and waiting with faith.', declaration: 'My hope is anchored in God’s promises and unfailing love.', items: [
    { title: 'Hope That Does Not Disappoint', reference: 'Romans 5:5', story: 'Paul taught that suffering can produce endurance, character, and hope through God’s love.', message: 'Biblical hope is not wishful thinking; it is confidence rooted in God’s character.', prayer: 'Lord, fill my heart with hope by Your Spirit.' },
    { title: 'Waiting With Faith', reference: 'Psalm 27:14', story: 'David learned to wait on the Lord while facing danger, delay, and uncertainty.', message: 'Waiting becomes worship when the heart chooses courage and trust instead of despair.', prayer: 'Father, strengthen my heart as I wait for You.' },
    { title: 'Encouraged by Promises', reference: '2 Corinthians 1:20', story: 'God’s covenant faithfulness sustained His people across generations.', message: 'The promises of God find their yes in Christ, giving believers courage for today.', prayer: 'Lord, help me stand on Your promises.' }
  ]},
  { id: 'purpose', title: 'Purpose Collection', icon: '🎯', color: 'from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30', description: 'Calling, obedience, faithfulness, gifts, daily purpose, and walking with God.', declaration: 'I am created for good works and called to walk faithfully with God.', items: [
    { title: 'Created for Good Works', reference: 'Ephesians 2:10', story: 'Esther discovered that her position had kingdom purpose in a critical moment.', message: 'Purpose is not only a destination; it is daily faithfulness to the good works God prepares.', prayer: 'Lord, help me recognize and walk in Your purpose today.' },
    { title: 'Faithful in Small Things', reference: 'Luke 16:10', story: 'David was faithful with sheep before he stood before kings.', message: 'God often develops calling through hidden faithfulness before public assignment.', prayer: 'Father, help me serve faithfully in today’s responsibilities.' },
    { title: 'Obedience and Calling', reference: 'Isaiah 6:8', story: 'Isaiah responded to God’s call with surrender: Here am I; send me.', message: 'Calling becomes fruitful when surrender meets obedience.', prayer: 'Lord, make my heart willing and my steps obedient.' }
  ]},
  { id: 'thanksgiving', title: 'Thanksgiving Collection', icon: '🙌', color: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30', description: 'Gratitude, worship, praise, joy, contentment, and remembering God’s goodness.', declaration: 'I will give thanks to the Lord in every season.', items: [
    { title: 'Give Thanks Always', reference: '1 Thessalonians 5:18', story: 'Paul and Silas sang praises in prison before the doors opened.', message: 'Thanksgiving is powerful because it honors God before circumstances change.', prayer: 'Lord, teach me gratitude in every season.' },
    { title: 'Remember His Benefits', reference: 'Psalm 103:2', story: 'David commanded his soul not to forget the Lord’s forgiveness, healing, and mercy.', message: 'Gratitude grows when memory is trained to remember grace.', prayer: 'Father, help me remember and praise You for Your goodness.' },
    { title: 'Joyful Worship', reference: 'Psalm 100:4', story: 'Israel entered worship with thanksgiving and praise because God was faithful.', message: 'Thanksgiving opens the heart to worship and re-centers life on God’s goodness.', prayer: 'Lord, fill my heart with joyful worship.' }
  ]}
];

const seasonalCollections = [
  { id: 'christmas', title: 'Christmas Devotions', icon: '🌟', season: 'Christmas', description: 'Christ’s birth, incarnation, hope, joy, peace, worship, and God’s gift to the world.', declaration: 'Christ has come; hope, joy, and salvation are alive in my heart.', items: [
    { title: 'The Promise of a Savior', reference: 'Isaiah 9:6', story: 'Isaiah spoke of a Child who would carry divine names and bring light to people walking in darkness.', message: 'Christmas begins before Bethlehem. It begins with God’s promise that darkness would not have the final word.', prayer: 'Father, thank You for sending Jesus, the promised Savior and Prince of Peace.' },
    { title: 'God With Us', reference: 'Matthew 1:23', story: 'Joseph learned that Mary’s child would be called Emmanuel, meaning God with us.', message: 'The miracle of Christmas is not only that Jesus came, but that God drew near to redeem, comfort, and dwell with His people.', prayer: 'Lord Jesus, let the reality of Your presence fill my home and heart.' },
    { title: 'Worship at the Manger', reference: 'Matthew 2:11', story: 'The wise men brought gifts and bowed before the child Jesus.', message: 'True Christmas worship gives Christ first place. The greatest gift we can bring is a surrendered heart.', prayer: 'Jesus, receive my worship, obedience, and gratitude today.' }
  ]},
  { id: 'easter', title: 'Easter Devotions', icon: '✝️', season: 'Easter', description: 'The cross, resurrection, forgiveness, victory, and new life in Christ.', declaration: 'Jesus is risen; sin, fear, and death do not have the final word.', items: [
    { title: 'It Is Finished', reference: 'John 19:30', story: 'On the cross Jesus declared that the work of redemption was complete.', message: 'The cross is not defeat; it is the place where love paid the debt and grace opened the way to God.', prayer: 'Lord Jesus, thank You for the finished work of the cross.' },
    { title: 'The Empty Tomb', reference: 'Luke 24:6', story: 'The women came to the tomb and heard the announcement that Jesus had risen.', message: 'The empty tomb changes every sorrow. Resurrection means God can bring life where people only see endings.', prayer: 'Risen Lord, fill me with resurrection hope and courage.' },
    { title: 'New Life in Christ', reference: 'Romans 6:4', story: 'Paul taught that believers are united with Christ in His death and resurrection.', message: 'Easter is not only an event to remember; it is a life to walk in. Christ calls us into newness of life.', prayer: 'Father, help me walk daily in the new life Jesus purchased for me.' }
  ]},
  { id: 'new-year', title: 'New Year Devotions', icon: '🎉', season: 'New Year', description: 'Fresh beginnings, consecration, vision, planning, courage, and trusting God for the year ahead.', declaration: 'This year belongs to the Lord; my steps are ordered by Him.', items: [
    { title: 'A New Thing', reference: 'Isaiah 43:19', story: 'God promised His people that He could make a way in the wilderness and rivers in the desert.', message: 'A new year is an invitation to trust God beyond old disappointments and limited expectations.', prayer: 'Lord, lead me into the new things You are doing with faith and obedience.' },
    { title: 'Numbering Our Days', reference: 'Psalm 90:12', story: 'Moses prayed for wisdom to live with eternity in view.', message: 'A fruitful year begins with a wise heart. Time is a stewardship, not merely a calendar.', prayer: 'Father, teach me to use my days wisely and live for what matters.' },
    { title: 'Commit Your Works', reference: 'Proverbs 16:3', story: 'Wisdom teaches that plans become established when they are committed to the Lord.', message: 'Planning is good, but surrender makes planning holy. Invite God into the year before rushing into activity.', prayer: 'Lord, I commit my plans, work, family, and future to You.' }
  ]},
  { id: 'thanksgiving', title: 'Thanksgiving Devotions', icon: '🙌', season: 'Thanksgiving', description: 'Gratitude, worship, remembrance, contentment, joy, and praising God in every season.', declaration: 'I will remember the goodness of God and give thanks in every season.', items: [
    { title: 'Give Thanks in Everything', reference: '1 Thessalonians 5:18', story: 'Paul taught believers to give thanks as part of God’s will in Christ.', message: 'Thanksgiving is not denial of difficulty; it is a decision to recognize God’s faithfulness inside every season.', prayer: 'Father, open my eyes to Your goodness and teach me gratitude.' },
    { title: 'Remember His Benefits', reference: 'Psalm 103:2', story: 'David commanded his soul not to forget the Lord’s benefits.', message: 'Gratitude grows when memory is disciplined. Remembering God’s mercy strengthens present faith.', prayer: 'Lord, help me remember Your forgiveness, healing, provision, and love.' },
    { title: 'Contentment and Joy', reference: 'Philippians 4:11', story: 'Paul learned contentment in seasons of abundance and need.', message: 'Thanksgiving matures when joy is no longer controlled by circumstances but rooted in Christ.', prayer: 'Jesus, teach me contentment and deepen my joy in You.' }
  ]},
  { id: 'advent', title: 'Advent Devotions', icon: '🕯️', season: 'Advent', description: 'Waiting, hope, preparation, repentance, expectation, and longing for Christ.', declaration: 'I wait with hope because God keeps His promises.', items: [
    { title: 'Waiting With Hope', reference: 'Romans 15:13', story: 'Israel waited for the Messiah through generations of promise and longing.', message: 'Advent teaches that waiting is not wasted when hope is anchored in the faithfulness of God.', prayer: 'God of hope, fill me with joy and peace as I wait on You.' },
    { title: 'Prepare the Way', reference: 'Mark 1:3', story: 'John the Baptist called people to prepare the way of the Lord.', message: 'Preparation is spiritual. The heart makes room for Christ through repentance, humility, and renewed obedience.', prayer: 'Lord, prepare my heart to receive You more fully.' },
    { title: 'Light in Darkness', reference: 'John 1:5', story: 'John declared that the light shines in darkness, and darkness cannot overcome it.', message: 'Advent hope shines precisely where darkness feels strongest. Christ is the light no darkness can defeat.', prayer: 'Jesus, shine Your light in every dark and weary place.' }
  ]},
  { id: 'lent', title: 'Lent Devotions', icon: '🌿', season: 'Lent', description: 'Repentance, surrender, fasting, humility, the cross, and deeper devotion to Christ.', declaration: 'I surrender my heart to Christ and follow Him with humility.', items: [
    { title: 'Return to the Lord', reference: 'Joel 2:12', story: 'The prophet called God’s people to return with fasting, weeping, and sincere hearts.', message: 'Lent is not empty ritual; it is a gracious invitation to return to God with honesty and humility.', prayer: 'Father, draw my heart back to You in sincere repentance and love.' },
    { title: 'Take Up Your Cross', reference: 'Luke 9:23', story: 'Jesus called His disciples to deny themselves, take up their cross daily, and follow Him.', message: 'Following Christ means surrendering self-rule. The cross shapes love, obedience, and daily discipleship.', prayer: 'Lord Jesus, teach me to follow You with surrendered devotion.' },
    { title: 'A Clean Heart', reference: 'Psalm 51:10', story: 'David prayed for cleansing after recognizing his sin before God.', message: 'God does not despise a broken and repentant heart. He restores what confession brings into the light.', prayer: 'Create in me a clean heart, O God, and renew a right spirit within me.' }
  ]}
];


const PUBLIC_TRANSLATIONS = [
  { code: 'kjv', label: 'KJV', name: 'King James Version' },
  { code: 'asv', label: 'ASV', name: 'American Standard Version' },
  { code: 'web', label: 'WEB', name: 'World English Bible' },
  { code: 'bbe', label: 'BBE', name: 'Bible in Basic English' },
  { code: 'darby', label: 'Darby', name: 'Darby Bible' },
  { code: 'ylt', label: 'YLT', name: 'Young’s Literal Translation' },
];
const LICENSED_TRANSLATIONS = ['NIV', 'NKJV', 'RSV', 'ESV', 'NASB'];
function getReadingPrefs() {
  try { return JSON.parse(localStorage.getItem('s4es-app-preferences') || '{}') || {}; } catch { return {}; }
}
function getTranslation() {
  const prefs = getReadingPrefs();
  const code = String(prefs.translation || 'kjv').toLowerCase();
  return PUBLIC_TRANSLATIONS.find(t => t.code === code) || PUBLIC_TRANSLATIONS[0];
}
function bibleUrl(ref, translationCode) {
  const t = (translationCode || getTranslation().code || 'kjv').toLowerCase();
  if (t === 'kjv') return `https://www.kingjamesbibleonline.org/search.php?q=${encodeURIComponent(ref)}`;
  return `https://bible-api.com/${encodeURIComponent(ref)}?translation=${encodeURIComponent(t)}`;
}

function usePassage(verse) {
  const translation = getTranslation();
  const [text, setText] = useState(verse.text || '');
  const [status, setStatus] = useState(verse.curated ? 'ready' : 'loading');
  useEffect(() => {
    let off = false;
    const t = getTranslation();
    setText(verse.text || '');
    setStatus(verse.curated ? 'ready' : 'loading');
    if (verse.curated && t.code === 'kjv') return;
    const key = `s4es-passage-${t.code}-${verse.ref}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached) { setText(cached); setStatus('ready'); return; }
    } catch {}
    fetch(`/api/passage?ref=${encodeURIComponent(verse.ref)}&translation=${encodeURIComponent(t.code)}`)
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (off) return;
        if (ok && d.text) {
          setText(d.text);
          setStatus('ready');
          try { localStorage.setItem(key, d.text); } catch {}
        } else {
          setText(`${t.label} passage lookup is temporarily unavailable. Use the Open Bible button to read ${verse.ref}.`);
          setStatus('fallback');
        }
      })
      .catch(() => {
        if (!off) {
          setText(`${t.label} passage lookup is temporarily unavailable. Use the Open Bible button to read ${verse.ref}.`);
          setStatus('fallback');
        }
      });
    return () => { off = true; };
  }, [verse.id, verse.ref, verse.text, verse.curated]);
  return { text, status, translation: getTranslation() };
}

const ThemeContext = React.createContext({ theme: 'light', setTheme: () => {} });
function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocal('s4es-theme', 'light');
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function Shell({ children }) {
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
    <div className="mx-auto max-w-6xl min-h-screen pb-24 md:pb-8"><Header />{children}<BottomNav /></div>
  </div>;
}

const navGroups = [
  { label: 'Read', items: [['/topics', 'Topics'], ['/bible', 'Bible'], ['/devotions', 'Devotions'], ['/plans', 'Plans']] },
  { label: 'Grow', items: [['/onboarding', 'Personalize'], ['/family', 'Family Devotions'], ['/collections', 'Special Collections'], ['/seasonal', 'Seasonal Devotions'], ['/launch', 'Launch'], ['/habits', 'Daily Habits'], ['/progress', 'Progress'], ['/analytics', 'Analytics'], ['/polish', 'UI Polish'], ['/quality', 'Content Quality'], ['/journal', 'Journal'], ['/favorites', 'Favorites'], ['/reminders', 'Reminders'], ['/settings', 'Settings'], ['/help', 'Help']] },
  { label: 'AI Tools', items: [['/assistant', 'Guidance AI'], ['/companion', 'Study AI'], ['/sermons', 'Sermons'], ['/study', 'Study Notes'], ['/about', 'About']] },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = React.useContext(ThemeContext);
  return <header className="sticky top-0 z-30 glass border-b border-slate-200/70 dark:border-slate-800">
    <div className="px-4 py-2.5 flex items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-soft shrink-0"><BookOpen size={21} /></div>
        <div className="min-w-0"><h1 className="font-black tracking-tight text-base md:text-xl truncate">Scriptures for Every Situation</h1><p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 truncate">V9.0 • Seasonal Devotions for Christmas, Easter, New Year, Thanksgiving, Advent, and Lent, plus special collections, family devotions, and AI tools.</p></div>
      </Link>
      <nav className="hidden lg:flex items-center gap-1.5 text-xs">
        <Nav to="/">Home</Nav>
        {navGroups.map(group => <div key={group.label} className="relative group"><button className="px-3 py-2 rounded-2xl font-black bg-white text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700">{group.label}</button><div className="absolute right-0 top-full hidden group-hover:block pt-2 w-48"><div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-soft p-2 grid gap-1">{group.items.map(([to, label]) => <Nav key={to} to={to}>{label}</Nav>)}</div></div></div>)}
        <Nav to="/profile">Profile</Nav>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" title="Toggle dark mode">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><Menu /></button>
      </div>
    </div>
    {open && <div className="lg:hidden px-4 pb-4 space-y-3"><div className="grid grid-cols-2 gap-2"><Nav to="/">Home</Nav><Nav to="/profile">Profile</Nav></div>{navGroups.map(group => <div key={group.label}><p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">{group.label}</p><div className="grid grid-cols-2 gap-2">{group.items.map(([to, label]) => <Nav key={to} to={to}>{label}</Nav>)}</div></div>)}</div>}
  </header>;
}

function Nav({ to, children }) {
  return <NavLink to={to} end={to === '/'} className={({ isActive }) => cls('px-3 py-2 rounded-2xl font-semibold text-center whitespace-nowrap transition', isActive ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800')}>{children}</NavLink>;
}

function BottomNav() {
  const primary = [['/', 'Home', Home], ['/bible', 'Bible', Library], ['/devotions', 'Morning', Sunrise], ['/assistant', 'AI', Sparkles], ['/profile', 'Profile', User]];
  const more = [['/topics', 'Topics', Grid3X3], ['/habits', 'Habits', Flame], ['/progress', 'Progress', ListChecks], ['/analytics', 'Analytics', BarChart3], ['/launch', 'Launch', Trophy], ['/polish', 'Polish', Activity], ['/quality', 'Quality', ShieldCheck], ['/journal', 'Journal', PenLine], ['/companion', 'Study AI', Sparkles], ['/sermons', 'Sermons', BookOpen], ['/favorites', 'Saved', Star], ['/seasonal', 'Seasonal', Sunrise], ['/reminders', 'Alerts', Bell], ['/study', 'Study', BrainCircuit], ['/settings', 'Settings', ShieldCheck], ['/about', 'About', BookOpen]];
  const [open, setOpen] = useState(false);
  return <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden"><div className="mx-auto max-w-md p-3 space-y-2">{open && <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-soft p-2 grid grid-cols-4 gap-1">{more.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => cls('rounded-2xl py-2 text-[10px] flex flex-col items-center gap-1', isActive ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400')}><Icon size={16} /><span>{label}</span></NavLink>)}</div>}<div className="grid grid-cols-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-soft p-2">{primary.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => cls('rounded-2xl py-2 text-[10px] flex flex-col items-center gap-1', isActive ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400')}><Icon size={17} /><span>{label}</span></NavLink>)}<button onClick={() => setOpen(!open)} className={cls('rounded-2xl py-2 text-[10px] flex flex-col items-center gap-1', open ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400')}><Menu size={17} /><span>More</span></button></div></div></div>;
}

function TopicCard({ topic }) {
  return <Link to={`/topic/${topic.id}`} className="block"><motion.div whileTap={{ scale: .98 }} className={cls('rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-soft transition bg-gradient-to-br dark:from-slate-900 dark:to-slate-800', topic.color)}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3 min-w-0"><div className="h-12 w-12 rounded-2xl bg-white/85 dark:bg-slate-950 flex items-center justify-center text-2xl shadow-sm">{topic.icon}</div><div className="min-w-0"><h3 className="font-bold text-slate-950 dark:text-white line-clamp-2">{topic.title}</h3><p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{topic.description}</p><p className="text-xs mt-1 font-semibold text-slate-500 dark:text-slate-400">{topic.verseCount} scriptures</p></div></div><ChevronRight className="text-slate-400" size={18} /></div></motion.div></Link>;
}

function Btn({ children, onClick }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 py-2 text-xs font-bold">{children}</button>;
}

function VerseCard({ verse, bookmarks, toggle }) {
  const marked = bookmarks.includes(verse.id);
  const { text, status, translation } = usePassage(verse);
  const full = { ...verse, text };
  return <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4"><div className="flex justify-between gap-3"><div><h4 className="font-black text-slate-950 dark:text-white">{verse.ref}</h4><p className="text-xs text-slate-500 dark:text-slate-400">{status === 'ready' ? translation.label : `${translation.label} lookup`}{status === 'loading' ? ' • loading passage...' : ''}</p></div>{toggle && <button onClick={() => toggle(verse.id)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">{marked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}</button>}</div><p className="text-[15px] leading-7 text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{text}</p><div className="flex flex-wrap gap-2"><Btn onClick={() => shareVerse(full)}><Share2 size={15} />Share</Btn><Btn onClick={() => speak(`${verse.ref}. ${text}`)}><Volume2 size={15} />Audio</Btn><Btn onClick={() => copyText(`${verse.ref}\n${text}`)}><Copy size={15} />Copy</Btn><a href={bibleUrl(verse.ref)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white px-3 py-2 text-xs font-bold"><ExternalLink size={15} />Open Bible</a></div></article>;
}

function VerseCardLite({ verse }) {
  const { text, status, translation } = usePassage(verse);
  const [favorites, setFavorites] = useLocal('s4es-favorites', []);
  const favId = `verse-${verse.id || verse.ref}`;
  const isFav = favorites.some(f => f.id === favId);
  const toggleFav = () => setFavorites(isFav ? favorites.filter(f => f.id !== favId) : [{ id: favId, type: 'Verse', title: verse.ref, ref: verse.ref, text, savedAt: new Date().toISOString() }, ...favorites]);
  const full = { ...verse, text };
  return <div className="rounded-3xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm"><p className="font-black">{verse.ref}</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{status === 'loading' ? `Loading ${translation.label} passage...` : translation.label}</p><p className="text-sm text-slate-700 dark:text-slate-100 leading-7 mt-2 whitespace-pre-wrap">{text}</p><div className="mt-3 flex flex-wrap gap-2"><Btn onClick={() => shareVerse(full)}><Share2 size={15} />Share</Btn><Btn onClick={() => speak(`${verse.ref}. ${text}`)}><Volume2 size={15} />Audio</Btn><Btn onClick={toggleFav}><Star size={15} />{isFav ? 'Saved' : 'Save'}</Btn><a href={bibleUrl(verse.ref)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white px-3 py-2 text-xs font-bold"><ExternalLink size={15} />Open Bible</a></div></div>;
}

function HomePage() {
  const [query, setQuery] = useState('');
  const topicResults = useMemo(() => searchTopics(query, topics), [query]);
  const verseResults = useMemo(() => searchVerses(query, verses), [query]);
  const daily = verses[dayOfYear() % verses.length];
  const devotion = devotions[(dayOfYear() - 1) % devotions.length];
  const [completed] = useLocal('s4es-completed-devotions', []);
  const [journal] = useLocal('s4es-prayer-journal', []);
  const [favorites] = useLocal('s4es-favorites', []);
  const [searchHistory, setSearchHistory] = useLocal('s4es-search-history', []);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => {
      setSearchHistory(prev => [{ q, at: new Date().toISOString() }, ...prev.filter(x => x.q.toLowerCase() !== q.toLowerCase())].slice(0, 30));
    }, 900);
    return () => clearTimeout(t);
  }, [query]);
  const streak = calcStreak(completed);
  const answered = journal.filter(e => e.status === 'Answered' || e.answered).length;
  const openRequests = journal.filter(e => (e.status || (e.answered ? 'Answered' : 'Waiting')) !== 'Answered').length;
  return <Shell><main className="p-4 md:p-8 space-y-8"><section className="rounded-[2rem] bg-slate-950 text-white p-6 md:p-10 shadow-soft overflow-hidden relative"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20" /><h2 className="text-3xl md:text-5xl font-black max-w-2xl">Find God's Word for every situation in life.</h2><p className="mt-3 text-slate-300 max-w-xl">V9.0 Seasonal Devotions is live: the app is now organized for public release with Bible reading, devotionals, prayer journal, reminders, streaks, AI guidance, Bible study, sermon builder, cloud sync, legal pages, feedback, and final launch checks.</p><div className="mt-6 bg-white rounded-3xl p-3 flex items-center gap-2 max-w-2xl"><Search className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you going through today? e.g. job, healing, fear, wisdom" className="w-full outline-none text-slate-950 bg-transparent" /></div><div className="mt-4 flex flex-wrap gap-2"><Link to="/journal" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Prayer Journal</Link><Link to="/reminders" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Reminders</Link><Link to="/devotions" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">365 Devotions</Link><Link to="/family" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">Family Devotions</Link><Link to="/collections" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">Special Collections</Link><Link to="/seasonal" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Seasonal Devotions</Link><Link to="/progress" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Streaks & Testimonies</Link><Link to="/sermons" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Sermon Builder</Link><Link to="/companion" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">AI Bible Study Companion</Link><Link to="/onboarding" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Personalize</Link><Link to="/help" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Help Center</Link><Link to="/analytics" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Analytics</Link><Link to="/habits" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">NEW: Daily Habits</Link><Link to="/launch" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">V9.0 Launch Center</Link><Link to="/polish" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">UI Polish</Link><Link to="/profile" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">V6.7 Cloud Sync</Link></div></section>{query && <section className="space-y-4"><h3 className="font-black text-xl">Search Results</h3><div className="grid md:grid-cols-2 gap-4">{topicResults.slice(0, 6).map(t => <TopicCard key={t.id} topic={t} />)}</div>{verseResults.length > 0 && <div className="grid md:grid-cols-2 gap-4">{verseResults.slice(0, 8).map(v => <VerseCardLite key={v.id} verse={v} />)}</div>}</section>}<Stats /><section className="grid md:grid-cols-4 gap-4"><Link to="/store-release" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Rocket size={34} /><h3 className="font-black text-2xl mt-3">Final Store Release Build</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Complete final QA, store listing text, PWA readiness, Android/iOS wrapper checklist, and launch pack.</p></Link><Link to="/ai-pro" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Bot size={34} /><h3 className="font-black text-2xl mt-3">AI Bible Study Assistant Pro</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Generate verse explanations, chapter summaries, topic studies, sermons, lessons, small-group guides, and devotions.</p></Link><Link to="/academy" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><GraduationCap size={34} /><h3 className="font-black text-2xl mt-3">Christian Growth Academy</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Structured discipleship schools with lessons, Scripture, quizzes, XP, certificates, and progress tracking.</p></Link><Link to="/memory" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Brain size={34} /><h3 className="font-black text-2xl mt-3">Bible Memory Verses & Quizzes</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Memorize daily verses from all 66 books and test your knowledge through Easy, Medium, Hard, and Very Hard Bible quizzes.</p></Link><Link to="/mobile" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Smartphone size={34} /><h3 className="font-black text-2xl mt-3">Mobile & App Store Readiness</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Prepare the app for PWA installation, Android, iPhone, app store listings, and final launch testing.</p></Link><Link to="/missions" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Globe2 size={34} /><h3 className="font-black text-2xl mt-3">Missions & Evangelism Mode</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Use outreach plans, salvation Scriptures, gospel guides, missionary prayer calendars, and follow-up discipleship tools.</p></Link><Link to="/community" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><MessageCircle size={34} /><h3 className="font-black text-2xl mt-3">Community Prayer & Testimony</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Record prayer requests, mark them prayed over, and save answered-prayer testimonies with safe sharing guidelines.</p></Link><Link to="/groups" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Users size={34} /><h3 className="font-black text-2xl mt-3">Church & Small Group Mode</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Lead small groups, family altar, youth discipleship, and church prayer with ready-made guides.</p></Link><DashboardCard to="/progress" icon={<Flame size={30} />} title={`${streak.current} Day Streak`} sub={`Longest streak: ${streak.longest} days`} /><DashboardCard to="/journal" icon={<CheckCircle2 size={30} />} title={`${answered} Answered Prayers`} sub={`${openRequests} open prayer requests`} /><DashboardCard to="/favorites" icon={<Star size={30} />} title={`${favorites.length} Favorites`} sub="Saved verses and devotions" /><DashboardCard to="/habits" icon={<Flame size={30} />} title="Daily Habit System" sub="Morning, noon, night check-ins and weekly summaries" /><DashboardCard to="/reminders" icon={<Clock size={30} />} title="Daily Prayer Rhythm" sub="Morning, noon, and night reminders" /><DashboardCard to="/analytics" icon={<BarChart3 size={30} />} title="Usage Analytics" sub="Searches, progress, feedback, and recent activity" /><DashboardCard to="/profile" icon={<Database size={30} />} title="Cloud Sync" sub="Backup and restore app data across devices with Supabase" /><DashboardCard to="/launch" icon={<Trophy size={30} />} title="V9.0 Launch Center" sub="Final production readiness checklist, route tests, legal pages, and go-live verification" /><DashboardCard to="/family" icon={<HeartHandshake size={30} />} title="Family Devotions" sub="Singles, couples, marriage, parenting, children, and youth devotional tracks" /><DashboardCard to="/collections" icon={<ShieldCheck size={30} />} title="Special Collections" sub="Healing, anxiety, prayer, leadership, finances, spiritual warfare, hope, purpose, and thanksgiving" /><DashboardCard to="/seasonal" icon={<Sunrise size={30} />} title="Seasonal Devotions" sub="Christmas, Easter, New Year, Thanksgiving, Advent, and Lent collections" /><DashboardCard to="/polish" icon={<Activity size={30} />} title="UI/UX Polish" sub="Compact navigation, launch layout checks, mobile spacing, and visual refinement" /><DashboardCard to="/quality" icon={<ShieldCheck size={30} />} title="Content Quality" sub="Review devotions, scripture references, prayers, and curation readiness" /></section><section className="grid md:grid-cols-5 gap-4"><Link to="/bible" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Library size={34} /><h3 className="font-black text-2xl mt-3">Read the Bible</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Browse all 66 books from Genesis to Revelation. Open any chapter in KJV and cache passages as you read.</p></Link><Link to={`/devotions/${devotion.day}`} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Sunrise size={34} /><h3 className="font-black text-2xl mt-3">Today's Morning Devotion</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{devotion.title}</p><p className="text-xs font-bold text-slate-500 mt-2">{devotion.reference}</p></Link><Link to="/journal" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><PenLine size={34} /><h3 className="font-black text-2xl mt-3">Prayer Journal</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Record prayers, testimonies, requests, and answered-prayer milestones on this device.</p></Link><Link to="/reminders" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Bell size={34} /><h3 className="font-black text-2xl mt-3">Prayer Reminders</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Set your morning devotion time and enable browser prayer notifications.</p></Link><Link to="/progress" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><ListChecks size={34} /><h3 className="font-black text-2xl mt-3">Devotion Progress</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Track completed devotions, streaks, and the next devotion to continue.</p></Link><Link to="/habits" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Flame size={34} /><h3 className="font-black text-2xl mt-3">Daily Habit System</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Check in for morning devotion, noon prayer, night reflection, streak recovery, and weekly growth summary.</p></Link><Link to="/family" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><HeartHandshake size={34} /><h3 className="font-black text-2xl mt-3">Family Devotions</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Singles, couples, marriage, parenting, children, and youth devotional collections with prayers and declarations.</p></Link><Link to="/collections" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><ShieldCheck size={34} /><h3 className="font-black text-2xl mt-3">Special Collections</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Healing, anxiety, prayer, leadership, financial breakthrough, spiritual warfare, hope, purpose, and thanksgiving collections.</p></Link><Link to="/seasonal" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Sunrise size={34} /><h3 className="font-black text-2xl mt-3">Seasonal Devotions</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Christmas, Easter, New Year, Thanksgiving, Advent, and Lent devotion tracks with prayer and reflection.</p></Link><Link to="/study" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><BrainCircuit size={34} /><h3 className="font-black text-2xl mt-3">Bible Study Workspace</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Create study notes, outlines, cross-reference lists, sermon points, and applications.</p></Link><Link to="/companion" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Sparkles size={34} /><h3 className="font-black text-2xl mt-3">AI Bible Study Companion</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Ask questions about passages, themes, cross references, context, and practical Christian application.</p></Link><Link to="/sermons" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><BookOpen size={34} /><h3 className="font-black text-2xl mt-3">Sermon Builder</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Prepare scripture-centered sermon outlines, teaching notes, applications, and closing prayers.</p></Link><Link to="/analytics" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><BarChart3 size={34} /><h3 className="font-black text-2xl mt-3">Usage Analytics</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Review searches, most-used areas, progress, feedback, and launch readiness signals.</p></Link><Link to="/settings" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><ShieldCheck size={34} /><h3 className="font-black text-2xl mt-3">Launch Center</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Manage backups, data import/export, app settings, privacy, and production launch readiness.</p></Link><Link to="/polish" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><Activity size={34} /><h3 className="font-black text-2xl mt-3">UI/UX Polish</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Review compact tabs, mobile navigation, empty states, spacing, and launch-ready interface details.</p></Link><Link to="/quality" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm hover:shadow-soft"><ShieldCheck size={34} /><h3 className="font-black text-2xl mt-3">Content Quality</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Audit scripture references, devotional stories, prayers, declarations, and launch content readiness.</p></Link></section><PersonalDashboard /><section><div className="flex items-center justify-between mb-4"><h3 className="font-black text-xl">Popular Topics</h3><Link to="/topics" className="font-bold text-sm">View all</Link></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{topics.slice(0, 8).map(t => <TopicCard key={t.id} topic={t} />)}</div></section><section><h3 className="font-black text-xl mb-4">Today's Scripture</h3><VerseCardLite verse={daily} /></section><InstallBanner /></main></Shell>;
}

function Stats() {
  return <div className="grid grid-cols-2 md:grid-cols-8 gap-3"><Stat to="/topics" icon={<Database />} value="2,400" label="Scripture references" /><Stat to="/topics" icon={<Grid3X3 />} value="24" label="Life topics" /><Stat to="/bible" icon={<Library />} value="66" label="Bible books" /><Stat to="/devotions" icon={<Sunrise />} value="365" label="Morning devotions" /><Stat to="/habits" icon={<Flame />} value="Daily" label="Habit system" /><Stat to="/progress" icon={<ListChecks />} value="Track" label="Progress & streaks" /><Stat to="/journal" icon={<PenLine />} value="New" label="Prayer journal" /><Stat to="/reminders" icon={<Bell />} value="New" label="Reminders" /><Stat to="/study" icon={<BrainCircuit />} value="Study" label="Bible workspace" /><Stat to="/companion" icon={<Sparkles />} value="AI" label="Bible companion" /><Stat to="/sermons" icon={<BookOpen />} value="Teach" label="Sermon builder" /><Stat to="/assistant" icon={<Sparkles />} value="AI" label="Guidance ready" /><Stat to="/analytics" icon={<BarChart3 />} value="V6.9" label="Analytics" /><Stat to="/settings" icon={<ShieldCheck />} value="V6.9" label="Launch center" /><Stat to="/seasonal" icon={<Sunrise />} value="V9.0" label="Seasonal devotions" /><Stat to="/quality" icon={<ShieldCheck />} value="QA" label="Content quality" /><Stat to="/profile" icon={<Database />} value="Sync" label="Cloud backup" /><Stat to="/onboarding" icon={<CheckCircle2 />} value="Setup" label="Personalize" /><Stat to="/help" icon={<HeartHandshake />} value="Help" label="FAQ & support" /></div>;
}
function Stat({ icon, value, label, to }) { return <Link to={to} className="rounded-3xl bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-soft transition block"><div className="text-slate-500 dark:text-slate-400">{icon}</div><div className="text-2xl font-black mt-2">{value}</div><div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{label}</div></Link>; }
function DashboardCard({ to, icon, title, sub }) { return <Link to={to} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm hover:shadow-soft transition"><div className="text-slate-500 dark:text-slate-400">{icon}</div><h3 className="font-black text-xl mt-2">{title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{sub}</p></Link>; }


function FamilyDevotionsPage() {
  const [selected, setSelected] = useLocal('s4es-family-selected', 'singles');
  const [completed, setCompleted] = useLocal('s4es-family-completed', []);
  const current = familyCollections.find(c => c.id === selected) || familyCollections[0];
  const toggle = (id, title) => {
    const key = `${id}:${title}`;
    setCompleted(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };
  const total = familyCollections.reduce((n, c) => n + c.devotions.length, 0);
  return <Shell><main className="p-4 md:p-8 space-y-8">
    <PageTitle title="V7.2 Family Devotions" sub="Devotional tracks for singles, couples, marriage, parenting, children, and youth — with prayers, declarations, plans, and progress tracking." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft">
      <h3 className="font-black text-2xl">Family spiritual growth dashboard</h3>
      <p className="text-slate-300 text-sm mt-2 max-w-3xl">Choose a family life stage, read short scripture-centered devotions, pray together, and mark progress. These collections are saved locally and can be synced in future cloud releases.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">6</p><p className="text-xs text-slate-300">Family tracks</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{total}</p><p className="text-xs text-slate-300">Starter devotions</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{completed.length}</p><p className="text-xs text-slate-300">Completed</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{Math.round((completed.length / Math.max(total, 1)) * 100)}%</p><p className="text-xs text-slate-300">Family progress</p></div>
      </div>
    </section>
    <section className="grid md:grid-cols-3 gap-4">
      {familyCollections.map(c => <button key={c.id} onClick={() => setSelected(c.id)} className={cls('text-left rounded-[2rem] border p-5 shadow-sm bg-gradient-to-br', c.color, selected === c.id ? 'ring-4 ring-slate-950/10 dark:ring-white/20' : '')}>
        <div className="text-4xl">{c.icon}</div><h3 className="font-black text-xl mt-3">{c.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{c.description}</p><p className="text-xs font-black mt-3 text-slate-500">{c.plan}</p>
      </button>)}
    </section>
    <section className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3"><div className="text-4xl">{current.icon}</div><div><h3 className="text-2xl font-black">{current.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{current.description}</p></div></div>
        {current.devotions.map((d, i) => {
          const key = `${current.id}:${d.title}`;
          const done = completed.includes(key);
          return <article key={d.title} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-500">DEVOTION {i + 1} • {d.reference}</p><h4 className="font-black text-xl">{d.title}</h4></div><button onClick={() => toggle(current.id, d.title)} className={cls('rounded-2xl px-3 py-2 text-xs font-black', done ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800')}>{done ? 'Completed' : 'Mark Complete'}</button></div>
            <div className="grid md:grid-cols-2 gap-3"><InfoBlock title="Bible story" text={d.story} /><InfoBlock title="Life message" text={d.message} /></div>
            <InfoBlock title="Prayer" text={d.prayer} />
            <p className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4 text-sm font-bold">Declaration: {current.declaration}</p>
            <div className="flex flex-wrap gap-2"><button onClick={() => speak(`${d.title}. ${d.reference}. ${d.message}. Prayer: ${d.prayer}`)} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-xs font-black">Listen</button><button onClick={() => copyText(`${d.title}\n${d.reference}\n\n${d.message}\n\nPrayer: ${d.prayer}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-black">Copy</button></div>
          </article>;
        })}
      </div>
      <aside className="space-y-4">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Family Prayer Plan</h4><ul className="mt-3 text-sm space-y-2 text-slate-600 dark:text-slate-300"><li>• Read one devotion together.</li><li>• Ask one reflection question.</li><li>• Pray the written prayer aloud.</li><li>• Let each person share one application.</li></ul></div>
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Family Declarations</h4><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Our home belongs to the Lord. We walk in love, wisdom, forgiveness, purity, courage, and purpose. Christ is the center of our family life.</p></div>
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Upcoming V7.3</h4><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Special collections for healing, anxiety, prayer, leadership, financial breakthrough, spiritual warfare, hope, purpose, and thanksgiving.</p></div>
      </aside>
    </section>
  </main></Shell>;
}
function InfoBlock({ title, text }) { return <div className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">{title}</p><p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{text}</p></div>; }


function SpecialCollectionsPage() {
  const [selected, setSelected] = useLocal('s4es-special-selected', 'healing');
  const [completed, setCompleted] = useLocal('s4es-special-completed', []);
  const [query, setQuery] = useState('');
  const current = specialCollections.find(c => c.id === selected) || specialCollections[0];
  const allItems = specialCollections.flatMap(c => c.items.map(item => ({ ...item, collection: c.title, collectionId: c.id })));
  const results = query.trim() ? allItems.filter(item => `${item.title} ${item.reference} ${item.message} ${item.collection}`.toLowerCase().includes(query.toLowerCase())) : [];
  const toggle = (id, title) => {
    const key = `${id}:${title}`;
    setCompleted(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };
  const total = specialCollections.reduce((n, c) => n + c.items.length, 0);
  const completedForCurrent = current.items.filter(d => completed.includes(`${current.id}:${d.title}`)).length;
  return <Shell><main className="p-4 md:p-8 space-y-8">
    <PageTitle title="V7.3 Special Collections" sub="Focused devotional libraries for healing, anxiety and peace, prayer, leadership, financial breakthrough, spiritual warfare, hope, purpose, and thanksgiving." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft">
      <h3 className="font-black text-2xl">Special collections dashboard</h3>
      <p className="text-slate-300 text-sm mt-2 max-w-3xl">Choose a focused collection, read scripture-centered devotions, mark progress, save favorites, copy notes, or listen aloud.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{specialCollections.length}</p><p className="text-xs text-slate-300">Collections</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{total}</p><p className="text-xs text-slate-300">Starter devotions</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{completed.length}</p><p className="text-xs text-slate-300">Completed</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{Math.round((completed.length / Math.max(total, 1)) * 100)}%</p><p className="text-xs text-slate-300">Overall progress</p></div>
      </div>
    </section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm flex gap-2 items-center"><Search className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search within special collections e.g. healing, fear, leadership, provision" className="w-full bg-transparent outline-none" /></section>
    {query && <section className="space-y-4"><h3 className="font-black text-xl">Collection Search Results</h3><div className="grid md:grid-cols-2 gap-4">{results.slice(0, 12).map(d => <article key={`${d.collectionId}-${d.title}`} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-black text-slate-500">{d.collection} • {d.reference}</p><h4 className="font-black text-lg mt-1">{d.title}</h4><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">{d.message}</p><div className="flex gap-2 mt-3"><button onClick={() => speak(`${d.title}. ${d.reference}. ${d.message}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-black">Audio</button><button onClick={() => copyText(`${d.title}\n${d.reference}\n\n${d.message}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-black">Copy</button></div></article>)}</div></section>}
    <section className="grid md:grid-cols-3 gap-4">
      {specialCollections.map(c => <button key={c.id} onClick={() => setSelected(c.id)} className={cls('text-left rounded-[2rem] border p-5 shadow-sm bg-gradient-to-br', c.color, selected === c.id ? 'ring-4 ring-slate-950/10 dark:ring-white/20' : '')}>
        <div className="text-4xl">{c.icon}</div><h3 className="font-black text-xl mt-3">{c.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{c.description}</p><p className="text-xs font-black mt-3 text-slate-500">{c.items.length} starter devotions</p>
      </button>)}
    </section>
    <section className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3"><div className="text-4xl">{current.icon}</div><div><h3 className="text-2xl font-black">{current.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{current.description}</p><p className="text-xs font-bold text-slate-500 mt-1">Progress: {completedForCurrent}/{current.items.length}</p></div></div>
        {current.items.map((d, i) => {
          const key = `${current.id}:${d.title}`;
          const done = completed.includes(key);
          return <article key={d.title} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-500">SPECIAL DEVOTION {i + 1} • {d.reference}</p><h4 className="font-black text-xl">{d.title}</h4></div><button onClick={() => toggle(current.id, d.title)} className={cls('rounded-2xl px-3 py-2 text-xs font-black', done ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-800')}>{done ? 'Completed' : 'Mark Complete'}</button></div>
            <div className="grid md:grid-cols-2 gap-3"><InfoBlock title="Bible story" text={d.story} /><InfoBlock title="Devotional message" text={d.message} /></div>
            <InfoBlock title="Prayer" text={d.prayer} />
            <p className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4 text-sm font-bold">Declaration: {current.declaration}</p>
            <div className="flex flex-wrap gap-2"><button onClick={() => speak(`${d.title}. ${d.reference}. ${d.message}. Prayer: ${d.prayer}`)} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-xs font-black">Listen</button><button onClick={() => copyText(`${d.title}\n${d.reference}\n\n${d.message}\n\nPrayer: ${d.prayer}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-black">Copy</button></div>
          </article>;
        })}
      </div>
      <aside className="space-y-4">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Collection rhythm</h4><ul className="mt-3 text-sm space-y-2 text-slate-600 dark:text-slate-300"><li>• Read one focused devotion.</li><li>• Pray the written prayer slowly.</li><li>• Copy one declaration.</li><li>• Mark complete when finished.</li></ul></div>
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Collection Declaration</h4><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{current.declaration}</p></div>
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Upcoming V9.0</h4><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Seasonal devotion collections for Christmas, Easter, New Year, Thanksgiving, Lent, and Advent.</p></div>
      </aside>
    </section>
  </main></Shell>;
}

function TopicsPage() {
  const groups = [...new Set(topics.map(t => t.group))];
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="All Topics" sub="Browse scriptures by life issue, prayer theme, or spiritual need." />{groups.map(g => <section key={g}><h3 className="font-black text-xl mb-4">{g}</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{topics.filter(t => t.group === g).map(t => <TopicCard key={t.id} topic={t} />)}</div></section>)}</main></Shell>;
}

function TopicPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const topic = topics.find(t => t.id === id) || topics[0];
  const [bookmarks, setBookmarks] = useLocal('s4es-bookmarks', []);
  const toggle = id => setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);
  return <Shell><main className="p-4 md:p-8 space-y-6"><button onClick={() => nav(-1)} className="inline-flex items-center gap-2 font-bold text-sm"><ArrowLeft size={17} />Back</button><section className={cls('rounded-[2rem] p-7 border shadow-soft bg-gradient-to-br dark:from-slate-900 dark:to-slate-800', topic.color)}><div className="text-5xl">{topic.icon}</div><h2 className="text-3xl font-black mt-3">{topic.title}</h2><p className="text-slate-700 dark:text-slate-200 mt-2">{topic.description}</p><p className="mt-3 font-bold text-sm">{topic.verseCount} scripture references • prayers • declarations</p></section><section className="grid md:grid-cols-2 gap-4"><div className="rounded-3xl bg-white dark:bg-slate-900 p-5 border dark:border-slate-800"><h3 className="font-black mb-3">Prayer Points</h3>{topic.prayers.map((p, i) => <p key={i} className="text-sm text-slate-700 dark:text-slate-200 mb-2">{i + 1}. {p}</p>)}</div><div className="rounded-3xl bg-white dark:bg-slate-900 p-5 border dark:border-slate-800"><h3 className="font-black mb-3">Declarations</h3>{topic.declarations.map((p, i) => <p key={i} className="text-sm text-slate-700 dark:text-slate-200 mb-2">{i + 1}. {p}</p>)}</div></section><section><h3 className="font-black text-xl mb-4 flex gap-2"><BookOpen /> Scriptures</h3><div className="grid md:grid-cols-2 gap-4">{topic.verses.map(v => <VerseCard key={v.id} verse={v} bookmarks={bookmarks} toggle={toggle} />)}</div></section></main></Shell>;
}

function BiblePage() {
  const [q, setQ] = useState('');
  const [testament, setTestament] = useState('All');
  const [selectedBook, setSelectedBook] = useState(bibleBooks[0]?.id || 'genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [recentChapters] = useLocal('s4es-recent-chapters', []);
  const [bibleNotes] = useLocal('s4es-bible-notes', {});
  const [bibleHighlights] = useLocal('s4es-bible-highlights', []);
  const [savedChapters] = useLocal('s4es-saved-chapters', []);
  const navigate = useNavigate();
  const selected = bibleBooks.find(b => b.id === selectedBook) || bibleBooks[0];
  const filtered = bibleBooks.filter(b => b.name.toLowerCase().includes(q.toLowerCase()) && (testament === 'All' || b.testament === testament));
  const groups = testament === 'All' ? ['Old Testament', 'New Testament'] : [testament];
  const noteCount = Object.values(bibleNotes || {}).filter(Boolean).length;
  function openSelection() {
    const chapter = Math.min(Math.max(parseInt(selectedChapter || 1, 10) || 1, 1), selected.chapters);
    navigate(`/bible/${selected.id}/${chapter}`);
  }
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="Full Bible Experience" sub="V6.6 Bible reader: browse Genesis to Revelation, search books, jump to chapters, keep chapter notes, save highlights, track recent reading, and cache KJV passages offline." />
    <section className="grid md:grid-cols-4 gap-4"><DashboardCard to="/bible" icon={<Library />} title="66 Books" sub="Old and New Testament navigation" /><DashboardCard to="/analytics" icon={<History />} title={`${recentChapters.length} Recent`} sub="Recently opened chapters" /><DashboardCard to="/favorites" icon={<Star />} title={`${savedChapters.length} Saved`} sub="Saved Bible chapters" /><DashboardCard to="/bible" icon={<PenLine />} title={`${noteCount} Notes`} sub="Personal Bible notes" /></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft space-y-4"><h3 className="font-black text-xl flex gap-2"><Search /> Bible Search & Chapter Picker</h3><div className="grid md:grid-cols-5 gap-3"><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search book: Genesis, Psalms, John..." className="md:col-span-2 w-full outline-none bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-3" /><select value={testament} onChange={e => setTestament(e.target.value)} className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option>All</option><option>Old Testament</option><option>New Testament</option></select><select value={selectedBook} onChange={e => { const b = bibleBooks.find(x => x.id === e.target.value); setSelectedBook(e.target.value); setSelectedChapter(1); }} className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">{bibleBooks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select><select value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">{Array.from({ length: selected?.chapters || 1 }, (_, i) => i + 1).map(n => <option key={n} value={n}>Chapter {n}</option>)}</select></div><button onClick={openSelection} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Open Selected Chapter</button></section>
    {recentChapters.length > 0 && <section><div className="flex items-center justify-between mb-4"><h3 className="font-black text-xl flex gap-2"><History /> Continue Reading</h3><Link to="/analytics" className="font-bold text-sm">View analytics</Link></div><div className="grid md:grid-cols-4 gap-3">{recentChapters.slice(0, 8).map(x => <Link key={x.path} to={x.path} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm hover:shadow-soft"><p className="font-black">{x.book} {x.chapter}</p><p className="text-xs text-slate-500 mt-1">{new Date(x.at).toLocaleString()}</p></Link>)}</div></section>}
    <section className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft"><h3 className="font-black text-xl mb-3 flex gap-2"><Star /> Saved / Highlighted Chapters</h3>{bibleHighlights.length || savedChapters.length ? <div className="space-y-2">{[...savedChapters.slice(0,6).map(x => ({...x, kind:'Saved'})), ...bibleHighlights.slice(0,6).map(x => ({...x, kind:'Highlighted'}))].slice(0,8).map((x, i) => <Link key={(x.path||x.ref||'')+i} to={x.path || '#'} className="block rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><b>{x.kind}: {x.ref || `${x.book} ${x.chapter}`}</b><span className="block text-xs text-slate-500">{x.note || 'Open chapter'}</span></Link>)}</div> : <p className="text-sm text-slate-500">Open a chapter and use Save Chapter or Add Highlight to populate this section.</p>}</div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft"><h3 className="font-black text-xl mb-3 flex gap-2"><PenLine /> Bible Notes</h3>{noteCount ? <div className="space-y-2">{Object.entries(bibleNotes).filter(([,v]) => v).slice(0,8).map(([key, val]) => <Link key={key} to={`/bible/${key.split('__')[0]}/${key.split('__')[1]}`} className="block rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><b>{key.replace('__', ' ')}</b><span className="block text-xs text-slate-500 line-clamp-1">{val}</span></Link>)}</div> : <p className="text-sm text-slate-500">Your chapter notes will appear here.</p>}</div></section>
    {groups.map(g => <section key={g}><h3 className="font-black text-xl mb-4">{g}</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{filtered.filter(b => b.testament === g).map(book => <Link key={book.id} to={`/bible/${book.id}/1`} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm hover:shadow-soft"><BookOpen /><h3 className="font-black mt-3">{book.name}</h3><p className="text-xs text-slate-500 mt-1">{book.chapters} chapter{book.chapters > 1 ? 's' : ''}</p></Link>)}</div></section>)}
  </main></Shell>;
}

function BibleChapterPage() {
  const { bookId, chapter } = useParams();
  const nav = useNavigate();
  const book = bibleBooks.find(b => b.id === bookId) || bibleBooks[0];
  const ch = Math.min(Math.max(parseInt(chapter || '1', 10) || 1, 1), book.chapters);
  const [notes, setNotes] = useLocal('s4es-bible-notes', {});
  const [highlights, setHighlights] = useLocal('s4es-bible-highlights', []);
  const [savedChapters, setSavedChapters] = useLocal('s4es-saved-chapters', []);
  const [prefs] = useLocal('s4es-reading-preferences', { fontSize: 'Comfortable' });
  const noteKey = `${book.id}__${ch}`;
  const ref = `${book.name} ${ch}`;
  const path = `/bible/${book.id}/${ch}`;
  useEffect(() => {
    try {
      const key = 's4es-recent-chapters';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const item = { bookId: book.id, book: book.name, chapter: ch, path, at: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify([item, ...current.filter(x => x.path !== item.path)].slice(0, 24)));
    } catch {}
  }, [book.id, ch]);
  const chapterVerse = { id: `bible-${book.id}-${ch}`, ref, text: '', curated: false };
  const passage = usePassage(chapterVerse);
  const prev = ch > 1 ? `/bible/${book.id}/${ch - 1}` : null;
  const next = ch < book.chapters ? `/bible/${book.id}/${ch + 1}` : null;
  const saved = savedChapters.some(x => x.path === path);
  function saveChapter() {
    const item = { bookId: book.id, book: book.name, chapter: ch, path, ref, savedAt: new Date().toISOString() };
    setSavedChapters(list => saved ? list.filter(x => x.path !== path) : [item, ...list.filter(x => x.path !== path)].slice(0, 100));
  }
  function addHighlight() {
    const note = prompt('Add a short highlight note for this chapter:', `Key lesson from ${ref}`);
    if (note === null) return;
    const item = { id: Date.now(), bookId: book.id, book: book.name, chapter: ch, path, ref, note: note || `Highlighted ${ref}`, createdAt: new Date().toISOString() };
    setHighlights(list => [item, ...list].slice(0, 200));
  }
  function shareChapter() {
    shareVerse({ ref, text: passage.text || `Read ${ref} in the Bible.` });
  }
  const fontClass = prefs.fontSize === 'Large' ? 'text-lg md:text-xl leading-9' : prefs.fontSize === 'Compact' ? 'text-sm leading-6' : 'text-base md:text-lg leading-8';
  return <Shell><main className="p-4 md:p-8 space-y-6"><button onClick={() => nav(-1)} className="inline-flex items-center gap-2 font-bold text-sm"><ArrowLeft size={17} />Back</button>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><p className="text-sm font-bold text-slate-500">{book.testament} • V6.6 Bible Experience</p><h2 className="text-3xl font-black mt-1">{book.name} {ch}</h2><p className="text-sm text-slate-500 mt-2">Multi-version public-domain chapter lookup, reading history, chapter notes, highlights, saved chapters, sharing, audio, and offline cache.</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={saveChapter} className={cls('rounded-2xl px-4 py-2 font-black text-sm', saved ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' : 'bg-slate-100 dark:bg-slate-800')}>{saved ? 'Saved Chapter' : 'Save Chapter'}</button><button onClick={addHighlight} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-black text-sm">Add Highlight</button><button onClick={shareChapter} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-black text-sm">Share Chapter</button><button onClick={() => speak(`${ref}. ${passage.text || ''}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-black text-sm">Audio</button><button onClick={() => copyText(`${ref}\n\n${passage.text || ''}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-black text-sm">Copy</button><a href={bibleUrl(ref)} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-black text-sm">Open Bible</a></div><div className="mt-4 flex flex-wrap gap-2">{Array.from({ length: book.chapters }, (_, i) => i + 1).map(n => <Link key={n} to={`/bible/${book.id}/${n}`} className={cls('h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold', n === ch ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800')}>{n}</Link>)}</div></section>
    <section className="grid md:grid-cols-3 gap-4"><div className="md:col-span-2 rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl mb-3 flex gap-2"><BookOpen /> {ref}</h3><p className={cls('whitespace-pre-wrap text-slate-700 dark:text-slate-200', fontClass)}>{passage.text || 'Loading Bible passage...'}</p><p className="text-xs font-bold text-slate-500 mt-4">Status: {passage.status === 'ready' ? 'Cached/ready' : passage.status}. Chapters are cached locally after lookup for offline reopening on this device.</p></div><aside className="space-y-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft"><h3 className="font-black mb-3 flex gap-2"><PenLine /> Chapter Notes</h3><textarea value={notes[noteKey] || ''} onChange={e => setNotes({ ...notes, [noteKey]: e.target.value })} placeholder={`Write your notes on ${ref}...`} className="w-full min-h-40 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-3 outline-none" /><p className="text-xs text-slate-500 mt-2">Saved automatically on this device. Cloud sync uses V6.3+ Profile sync.</p></div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft"><h3 className="font-black mb-3 flex gap-2"><Star /> Highlights</h3>{highlights.filter(h => h.path === path).length ? <div className="space-y-2">{highlights.filter(h => h.path === path).map(h => <div key={h.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><p className="text-sm font-bold">{h.note}</p><p className="text-[11px] text-slate-500">{new Date(h.createdAt).toLocaleString()}</p></div>)}</div> : <p className="text-sm text-slate-500">No highlights for this chapter yet.</p>}</div></aside></section>
    <div className="flex justify-between gap-3">{prev ? <Link to={prev} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-bold">Previous chapter</Link> : <span />}{next && <Link to={next} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-3 font-bold">Next chapter</Link>}</div>
  </main></Shell>;
}

function DevotionsPage() {
  const today = devotions[(dayOfYear() - 1) % devotions.length];
  const [completed] = useLocal('s4es-completed-devotions', []);
  const completedSet = new Set(completed);
  const pct = Math.round((completed.length / devotions.length) * 100);
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="Daily Morning Devotions" sub="A 365-day morning devotional journey with scripture, story, reflection, prayer, declaration, and progress tracking." /><section className="grid md:grid-cols-3 gap-4"><Link to={`/devotions/${today.day}`} className="block rounded-[2rem] bg-slate-950 text-white p-7 shadow-soft"><Sunrise size={38} /><h3 className="text-2xl font-black mt-3">Today's Devotion</h3><p className="text-slate-300 mt-2">{today.title}</p><p className="text-xs font-bold mt-2">{today.reference}</p></Link><Link to="/progress" className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-7 shadow-sm hover:shadow-soft"><ListChecks size={38} /><h3 className="text-2xl font-black mt-3">Your Progress</h3><p className="text-slate-600 dark:text-slate-300 mt-2">{completed.length} of 365 devotions completed.</p><div className="mt-4 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-slate-950 dark:bg-white" style={{ width: `${pct}%` }} /></div><p className="text-xs font-bold text-slate-500 mt-2">{pct}% complete</p></Link><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-7 shadow-sm"><HeartHandshake size={38} /><h3 className="text-2xl font-black mt-3">Devotional Habit</h3><p className="text-slate-600 dark:text-slate-300 mt-2">Read, reflect, pray, declare, and mark each devotion complete to build consistency.</p></section></section><section><h3 className="font-black text-xl mb-4">All 365 Morning Devotions</h3><div className="grid md:grid-cols-3 gap-4">{devotions.map(d => <Link key={d.day} to={`/devotions/${d.day}`} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm hover:shadow-soft"><div className="flex justify-between gap-3"><p className="text-xs font-bold text-slate-500">Day {d.day}</p>{completedSet.has(d.day) && <span className="text-xs font-black text-emerald-600">Completed</span>}</div><h3 className="font-black mt-1">{d.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{d.reflection}</p><p className="text-xs font-bold text-slate-500 mt-2">{d.reference}</p></Link>)}</div></section></main></Shell>;
}

function DevotionPage() {
  const { day } = useParams();
  const nav = useNavigate();
  const d = devotions.find(x => String(x.day) === String(day)) || devotions[(dayOfYear() - 1) % devotions.length];
  const [completed, setCompleted] = useLocal('s4es-completed-devotions', []);
  const done = completed.includes(d.day);
  const markComplete = () => setCompleted(done ? completed.filter(x => x !== d.day) : [...completed, d.day].sort((a, b) => a - b));
  const refVerse = { id: `devotion-${d.day}`, ref: d.reference, text: '', curated: false };
  const prev = d.day > 1 ? `/devotions/${d.day - 1}` : null;
  const next = d.day < 365 ? `/devotions/${d.day + 1}` : null;
  return <Shell><main className="p-4 md:p-8 space-y-6"><button onClick={() => nav(-1)} className="inline-flex items-center gap-2 font-bold text-sm"><ArrowLeft size={17} />Back</button><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"><div><p className="text-sm font-bold text-slate-500">Day {d.day} • {d.theme}</p><h2 className="text-3xl font-black mt-1">{d.title}</h2><p className="text-slate-600 dark:text-slate-300 mt-3">{d.opening}</p></div><button onClick={markComplete} className={cls('rounded-2xl px-5 py-3 font-black flex items-center justify-center gap-2', done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-950 text-white dark:bg-white dark:text-slate-950')}><CheckCircle2 />{done ? 'Completed' : 'Mark Complete'}</button></div></section><VerseCardLite verse={refVerse} /><DevotionBlock title="Bible Story / Background" text={d.bibleStory} /><DevotionBlock title="Real-Life Story / Application" text={d.lifeStory} /><DevotionBlock title="Message Interpretation" text={d.message || d.interpretation} /><DevotionBlock title="Scripture Application" text={d.interpretation || d.reflection} /><DevotionBlock title="Reflection" text={d.reflection} /><DevotionBlock title="Reflection Question" text={d.reflectionQuestion} /><DevotionBlock title="Morning Prayer" text={d.prayer} /><DevotionBlock title="Declaration" text={d.declaration} /><DevotionBlock title="Today's Action Step" text={d.actionStep || d.action} /><div className="flex justify-between gap-3">{prev ? <Link to={prev} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-bold">Previous devotion</Link> : <span />}{next && <Link to={next} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-3 font-bold">Next devotion</Link>}</div></main></Shell>;
}

function DevotionBlock({ title, text }) { return <section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black mb-2 flex gap-2"><ListChecks />{title}</h3><p className="text-sm leading-7 text-slate-700 dark:text-slate-100">{text}</p></section>; }

function PlansPage() {
  return <Shell><main className="p-4 md:p-8"><PageTitle title="Reading Plans" sub="30-day journeys of scripture, prayer, and declarations." /><div className="grid md:grid-cols-3 gap-4 mt-6">{plans.map(p => { const t = topics.find(x => x.id === p.topicId); return <Link key={p.id} to={`/topic/${p.topicId}`} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="text-3xl">{t?.icon}</div><h3 className="font-black mt-3">{p.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{p.description}</p><p className="mt-3 text-xs font-bold text-slate-500">{p.days} days</p></Link>; })}</div></main></Shell>;
}


function StudyPage() {
  const [query, setQuery] = useState('Romans 8');
  const [notes, setNotes] = useLocal('s4es-study-notes', []);
  const [draft, setDraft] = useState({ title: '', passage: '', observation: '', interpretation: '', application: '', prayer: '' });
  const matches = useMemo(() => searchVerses(query, verses).slice(0, 8), [query]);
  const topicMatches = useMemo(() => searchTopics(query, topics).slice(0, 6), [query]);
  function saveStudy() {
    const title = draft.title.trim() || query || 'Bible Study Note';
    const note = { id: Date.now().toString(), ...draft, title, passage: draft.passage || query, createdAt: new Date().toISOString() };
    setNotes([note, ...notes]);
    setDraft({ title: '', passage: '', observation: '', interpretation: '', application: '', prayer: '' });
  }
  function removeNote(id) { setNotes(notes.filter(n => n.id !== id)); }
  function fillFromVerse(v) {
    setDraft({
      title: `Study on ${v.ref}`,
      passage: v.ref,
      observation: `What does ${v.ref} say in its immediate context? Read the surrounding chapter and note repeated words, commands, promises, warnings, and the character of God revealed in the passage.`,
      interpretation: `Ask what the original biblical message teaches before applying it personally. Compare this passage with related scriptures and avoid forcing the text to say what it does not say.`,
      application: `Identify one obedient response: a belief to embrace, a sin to reject, a promise to trust, a prayer to pray, or a step of wisdom to take today.`,
      prayer: `Father, help me understand ${v.ref} faithfully, receive Your Word with humility, and obey it today in Jesus' name. Amen.`
    });
  }
  function outline() {
    const q = query || draft.passage || 'this passage';
    setDraft({
      title: `Study Guide: ${q}`,
      passage: q,
      observation: `Read ${q} slowly. Note who is speaking, who is addressed, what problem is being answered, and what words or promises are repeated.`,
      interpretation: `The passage should be interpreted through its biblical context, the character of God, the work of Christ, and the wider witness of Scripture.`,
      application: `Turn the passage into practice: one truth to believe, one prayer to pray, one attitude to change, and one act of obedience today.`,
      prayer: `Lord, open my understanding, guide me into truth, and help me live according to Your Word. Amen.`
    });
  }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Bible Study Workspace" sub="Create notes, study passages, prepare sermon outlines, connect verses with topics, and save applications for later." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft"><h3 className="font-black text-2xl flex items-center gap-2"><BrainCircuit /> Study any passage or life issue</h3><p className="text-slate-300 mt-2 text-sm">Type a reference such as Romans 8, Psalm 23, John 15, or a life issue such as fear, healing, direction, wisdom, marriage, money, or faith.</p><div className="mt-4 bg-white rounded-3xl p-3 flex items-center gap-2"><Search className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search passage, topic, or situation" className="w-full outline-none text-slate-950 bg-transparent" /></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={outline} className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">Generate Study Template</button><Link to="/assistant" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">Ask AI Assistant</Link><Link to="/bible" className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black">Open Bible Reader</Link></div></section>
    <section className="grid md:grid-cols-3 gap-4"><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black">Observation</h3><p className="text-sm text-slate-500 mt-2">What does the passage actually say? Who, what, when, where, why?</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black">Interpretation</h3><p className="text-sm text-slate-500 mt-2">What does it mean in context, and how does it fit the Bible story?</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black">Application</h3><p className="text-sm text-slate-500 mt-2">What should I believe, pray, obey, confess, or change today?</p></div></section>
    <section className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft space-y-3"><h3 className="font-black text-xl">Study Note Editor</h3><input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Study title" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={draft.passage} onChange={e => setDraft({ ...draft, passage: e.target.value })} placeholder="Passage or topic" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><textarea value={draft.observation} onChange={e => setDraft({ ...draft, observation: e.target.value })} placeholder="Observation notes" className="w-full min-h-24 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><textarea value={draft.interpretation} onChange={e => setDraft({ ...draft, interpretation: e.target.value })} placeholder="Interpretation/message" className="w-full min-h-24 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><textarea value={draft.application} onChange={e => setDraft({ ...draft, application: e.target.value })} placeholder="Application/action step" className="w-full min-h-24 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><textarea value={draft.prayer} onChange={e => setDraft({ ...draft, prayer: e.target.value })} placeholder="Prayer from this study" className="w-full min-h-20 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><button onClick={saveStudy} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Save Study Note</button></div>
      <div className="space-y-4"><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black mb-3">Related Topics</h3><div className="grid grid-cols-2 gap-2">{topicMatches.map(t => <Link key={t.id} to={`/topic/${t.id}`} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm font-bold">{t.icon} {t.title}</Link>)}</div></section><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black mb-3">Related Verses</h3><div className="space-y-2">{matches.length ? matches.map(v => <button key={v.id} onClick={() => fillFromVerse(v)} className="block w-full text-left rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm"><b>{v.ref}</b><span className="block text-xs text-slate-500">Click to build a study template from this verse.</span></button>) : <p className="text-sm text-slate-500">No verse matches yet.</p>}</div></section></div></section>
    <section><h3 className="font-black text-xl mb-4">Saved Study Notes</h3>{notes.length === 0 ? <div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center text-slate-500">No study notes yet.</div> : <div className="grid md:grid-cols-2 gap-4">{notes.map(n => <article key={n.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-slate-500">{new Date(n.createdAt).toLocaleDateString()} • {n.passage}</p><h3 className="font-black text-xl mt-1">{n.title}</h3></div><button onClick={() => removeNote(n.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><Trash2 /></button></div><p className="mt-3 text-sm leading-7"><b>Observation:</b> {n.observation}</p><p className="mt-2 text-sm leading-7"><b>Interpretation:</b> {n.interpretation}</p><p className="mt-2 text-sm leading-7"><b>Application:</b> {n.application}</p>{n.prayer && <p className="mt-2 text-sm leading-7"><b>Prayer:</b> {n.prayer}</p>}</article>)}</div>}</section>
  </main></Shell>;
}


function SermonBuilderPage() {
  const [sermons, setSermons] = useLocal('s4es-sermon-outlines', []);
  const [form, setForm] = useState({ title: '', passage: 'Psalm 23', topic: 'Divine Direction', audience: 'church', keyMessage: '', format: '3-point' });
  const [assistantInput, setAssistantInput] = useState('Preach on divine direction for young adults using Proverbs 3:5-6.');
  const [aiSermon, setAiSermon] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const relatedVerses = useMemo(() => searchVerses(`${form.passage} ${form.topic}`, verses).slice(0, 6), [form.passage, form.topic]);
  const relatedTopics = useMemo(() => searchTopics(form.topic || form.passage, topics).slice(0, 4), [form.topic, form.passage]);
  const outline = useMemo(() => {
    const passage = form.passage || 'the selected passage';
    const topic = form.topic || 'faithful Christian living';
    const title = form.title || `Sermon on ${topic}`;
    const key = form.keyMessage || `God's Word gives wisdom, direction, correction, hope, and practical strength for ${topic.toLowerCase()}.`;
    const fivePoint = form.format === '5-point';
    const points = [
      `God reveals His character through ${passage}. The first task of preaching is not self-help but beholding who God is.`,
      `The passage exposes the condition of the human heart in relation to ${topic.toLowerCase()}. It shows where we must trust, repent, wait, obey, or receive grace.`,
      `The message calls the hearer to a concrete response: prayer, faith, obedience, forgiveness, courage, generosity, patience, or worship.`,
      `The Word gives comfort without removing responsibility. Grace strengthens believers to obey in daily life.`,
      `The sermon should lead the listener from hearing Scripture to practicing Scripture with humility and faith.`
    ];
    return {
      title,
      passage,
      topic,
      audience: form.audience || 'church',
      bigIdea: key,
      introduction: `Begin by naming the real human need behind ${topic.toLowerCase()}: uncertainty, fear, waiting, pressure, weakness, or the desire to obey God. Then show that ${passage} speaks into that need with the authority and comfort of Scripture.`,
      context: `Read ${passage} carefully in its biblical setting. Ask who is speaking, who is addressed, what promise, command, warning, or revelation is being given, and how the passage points us back to God's character and forward to faithful obedience.`,
      illustration: `A modern believer facing ${topic.toLowerCase()} may feel pressured to rush, fear, compare, or compromise. This sermon can use a simple life story of someone who paused to pray, sought wise counsel, obeyed Scripture, and later saw God's faithfulness in the outcome.`,
      points: fivePoint ? points : points.slice(0, 3),
      applications: [
        `Pray before making decisions connected to ${topic.toLowerCase()}.`,
        `Write one command or promise from ${passage} and meditate on it today.`,
        `Take one practical step of obedience within the next 24 hours.`,
        `Share the message with someone who needs encouragement in this area.`
      ],
      prayerPoints: [
        `Father, open our hearts to receive Your Word concerning ${topic.toLowerCase()}.`,
        `Lord, remove fear, confusion, pride, and unbelief from our hearts.`,
        `Holy Spirit, help us obey the truth we have heard today.`,
        `Let this message produce faith, repentance, wisdom, and practical obedience.`
      ],
      closingPrayer: `Father, let Your Word in ${passage} shape our thoughts, desires, choices, and actions. Give us grace to hear, believe, and obey. Let this sermon bear fruit in our lives and point us to Christ. Amen.`
    };
  }, [form]);
  function saveSermon() {
    const payload = aiSermon ? { id: Date.now().toString(), title: form.title || `AI Sermon: ${form.topic}`, passage: form.passage, topic: form.topic, bigIdea: 'Generated sermon assistant output', closingPrayer: 'See saved sermon body.', aiBody: aiSermon, createdAt: new Date().toISOString() } : { id: Date.now().toString(), ...outline, createdAt: new Date().toISOString() };
    setSermons([payload, ...sermons]);
    alert('Sermon outline saved on this device.');
  }
  function removeSermon(id) { setSermons(sermons.filter(s => s.id !== id)); }
  const sermonText = `${outline.title}\nPassage: ${outline.passage}\nTopic: ${outline.topic}\nAudience: ${outline.audience}\n\nBig Idea:\n${outline.bigIdea}\n\nIntroduction:\n${outline.introduction}\n\nBible Context:\n${outline.context}\n\nIllustration / Life Story:\n${outline.illustration}\n\nMain Points:\n${outline.points.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nApplications:\n${outline.applications.map(a => `- ${a}`).join('\n')}\n\nPrayer Points:\n${outline.prayerPoints.map(p => `- ${p}`).join('\n')}\n\nClosing Prayer:\n${outline.closingPrayer}`;
  async function generateAiSermon() {
    const prompt = assistantInput.trim() || `${form.topic} using ${form.passage} for ${form.audience}`;
    setAiLoading(true); setAiError(''); setAiSermon('');
    const request = `Create a complete Christian sermon from this request: ${prompt}. Include sermon title, Bible text, Bible context, big idea, introduction, ${form.format === '5-point' ? 'five' : 'three'} main points, supporting scriptures, one biblical story, one modern life illustration, practical applications, prayer points, and closing prayer. Keep it scripture-centered, pastoral, and non-denominational.`;
    try {
      const r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ situation: request, topics, mode: 'sermon' }) });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.error || 'AI sermon assistant failed.');
      setAiSermon(d.answer || d.message || sermonText);
    } catch (e) {
      setAiError(e.message || 'AI unavailable. Showing local sermon outline instead.');
      setAiSermon(sermonText);
    } finally {
      setAiLoading(false);
    }
  }
  const displayText = aiSermon || sermonText;
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="AI Sermon Builder Assistant" sub="Enter a topic, scripture, or life issue and generate a sermon with Bible context, big idea, outline, stories, applications, prayer points, and closing prayer." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft space-y-4"><h3 className="font-black text-2xl flex gap-2"><Sparkles /> Generate a sermon automatically</h3><p className="text-slate-300 text-sm">Example: “Preach on divine direction for students using Proverbs 3:5-6” or “A sermon on healing and faith from Mark 5.”</p><textarea value={assistantInput} onChange={e => setAssistantInput(e.target.value)} className="w-full min-h-28 rounded-3xl bg-white text-slate-950 p-4 outline-none" placeholder="Enter sermon topic, scripture, audience, or life issue" /><div className="flex flex-wrap gap-2"><button onClick={generateAiSermon} disabled={aiLoading} className="rounded-2xl bg-white text-slate-950 px-5 py-3 font-black disabled:opacity-50">{aiLoading ? 'Generating...' : 'Generate Full Sermon'}</button><button onClick={() => copyText(displayText)} className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 font-black">Copy Sermon</button><button onClick={() => speak(displayText.slice(0, 900))} className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 font-black">Audio Read-Aloud</button></div>{aiError && <p className="text-xs text-amber-200">{aiError}</p>}</section>
    <section className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft space-y-3"><h3 className="font-black text-xl flex gap-2"><BookOpen /> Sermon Inputs</h3><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sermon title" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={form.passage} onChange={e => setForm({ ...form, passage: e.target.value })} placeholder="Bible passage e.g. Psalm 23" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Topic e.g. Divine Direction" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option value="church">Church congregation</option><option value="youth">Youth group</option><option value="students">Students</option><option value="family">Family devotion</option><option value="small group">Small group</option></select><select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option value="3-point">3-point sermon</option><option value="5-point">5-point sermon</option></select><textarea value={form.keyMessage} onChange={e => setForm({ ...form, keyMessage: e.target.value })} placeholder="Optional key message or burden for this sermon" className="w-full min-h-28 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><div className="flex flex-wrap gap-2"><button onClick={saveSermon} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Save Sermon</button><button onClick={() => copyText(displayText)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Copy Outline</button><button onClick={() => speak(`${outline.title}. ${outline.bigIdea}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Audio Summary</button></div></div>
      <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft space-y-4"><p className="text-xs font-bold text-slate-500">SERMON PREVIEW</p>{aiSermon ? <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-100 font-sans">{aiSermon}</pre> : <><h3 className="font-black text-2xl">{outline.title}</h3><p className="text-sm text-slate-500"><b>Passage:</b> {outline.passage} • <b>Topic:</b> {outline.topic} • <b>Audience:</b> {outline.audience}</p><div><h4 className="font-black">Big Idea</h4><p className="text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.bigIdea}</p></div><div><h4 className="font-black">Bible Story / Context</h4><p className="text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.context}</p></div><div><h4 className="font-black">Illustration / Life Story</h4><p className="text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.illustration}</p></div><div><h4 className="font-black">Main Points</h4><ol className="list-decimal pl-5 text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.points.map((p, i) => <li key={i}>{p}</li>)}</ol></div><div><h4 className="font-black">Applications</h4><ul className="list-disc pl-5 text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.applications.map((p, i) => <li key={i}>{p}</li>)}</ul></div><div><h4 className="font-black">Prayer Points</h4><ul className="list-disc pl-5 text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.prayerPoints.map((p, i) => <li key={i}>{p}</li>)}</ul></div><div><h4 className="font-black">Closing Prayer</h4><p className="text-sm leading-7 text-slate-700 dark:text-slate-100">{outline.closingPrayer}</p></div></>}</article></section>
    <section className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black mb-3">Related Topics</h3><div className="grid grid-cols-2 gap-2">{relatedTopics.map(t => <Link key={t.id} to={`/topic/${t.id}`} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm font-bold">{t.icon} {t.title}</Link>)}</div></div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black mb-3">Related Scriptures</h3><div className="space-y-2">{relatedVerses.map(v => <Link key={v.id} to={`/topic/${v.topicId || ''}`} className="block rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm"><b>{v.ref}</b><span className="block text-xs text-slate-500">Use as supporting scripture or cross-reference.</span></Link>)}</div></div></section>
    <section><h3 className="font-black text-xl mb-4">Saved Sermon Outlines</h3>{sermons.length === 0 ? <div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center text-slate-500">No sermon outlines yet.</div> : <div className="grid md:grid-cols-2 gap-4">{sermons.map(s => <article key={s.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-slate-500">{new Date(s.createdAt).toLocaleDateString()} • {s.passage}</p><h3 className="font-black text-xl mt-1">{s.title}</h3></div><button onClick={() => removeSermon(s.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><Trash2 /></button></div>{s.aiBody ? <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 font-sans">{s.aiBody}</pre> : <><p className="mt-3 text-sm leading-7"><b>Big Idea:</b> {s.bigIdea}</p><p className="mt-2 text-sm leading-7"><b>Closing Prayer:</b> {s.closingPrayer}</p></>}</article>)}</div>}</section>
  </main></Shell>;
}


function BibleStudyCompanionPage() {
  const [question, setQuestion] = useState('Explain Psalm 23 and show how I can apply it today.');
  const [mode, setMode] = useState('Passage Explanation');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useLocal('s4es-ai-study-companion-notes', []);
  const prompts = [
    'Explain Romans 8 with cross references and practical application.',
    'Give me scriptures and interpretation on overcoming fear.',
    'Explain David and Goliath as a lesson for courage and faith.',
    'Show me the biblical meaning of divine direction using Proverbs 3:5-6.',
    'Compare Joseph, Esther, and Daniel on favor and purpose.'
  ];
  function localAnswer(q) {
    const ql = q.toLowerCase();
    const related = verses.filter(v => (`${v.ref} ${v.topicTitle || ''} ${v.text || ''}`).toLowerCase().includes(ql.split(/\s+/)[0] || 'faith')).slice(0, 6);
    const refs = related.length ? related.map(v => `- ${v.ref} — ${v.topicTitle || 'Scripture'}`).join('\n') : '- Proverbs 3:5-6\n- Psalm 23:1\n- Isaiah 41:10\n- Romans 8:28\n- James 1:5';
    return `# ${mode}\n\n## Question\n${q}\n\n## Biblical Explanation\nThis passage or topic should be read with reverence for the whole counsel of Scripture. Ask what the text reveals about God, what it exposes in the human heart, and how it points us toward faith, obedience, wisdom, and prayer.\n\n## Context\nConsider who is speaking, who is being addressed, what problem or promise is in view, and how the surrounding verses shape the meaning. Avoid lifting a verse away from its biblical setting.\n\n## Key Scriptures\n${refs}\n\n## Interpretation\nThe central message is that God calls His people to trust Him, obey His Word, and respond to life's situations with faith rather than fear. The passage should not be treated as a magic formula but as an invitation to know God more deeply and walk in His wisdom.\n\n## Practical Application\n1. Pray before acting.\n2. Write down the instruction, promise, or warning in the passage.\n3. Identify one area where you need obedience today.\n4. Share the scripture with someone who needs encouragement.\n\n## Prayer\nFather, open my understanding to Your Word. Help me not only to read Scripture but to obey it. Guide my heart, strengthen my faith, and let Your Word shape my decisions today. Amen.`;
  }
  async function askCompanion() {
    if (!question.trim()) return;
    setLoading(true); setError(''); setAnswer('');
    const situation = `Bible Study Companion request. Mode: ${mode}. User question: ${question}. Provide Bible context, interpretation, cross references, practical application, reflection questions, and prayer.`;
    try {
      const r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ situation, topics: topics.slice(0, 20), mode }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'AI request failed');
      setAnswer(d.answer || d.message || localAnswer(question));
    } catch (e) {
      setError('AI service unavailable, showing built-in study guidance. ' + (e.message || ''));
      setAnswer(localAnswer(question));
    } finally { setLoading(false); }
  }
  function saveStudy() {
    if (!answer) return alert('Generate a study answer first.');
    setSaved([{ id: Date.now().toString(), question, mode, answer, createdAt: new Date().toISOString() }, ...saved]);
    alert('Bible study note saved on this device.');
  }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="AI Bible Study Companion" sub="Ask about any passage, biblical theme, person, story, doctrine, or life issue and receive context, interpretation, cross references, application, and prayer." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft space-y-4"><h3 className="font-black text-2xl flex gap-2"><Sparkles /> Ask a Bible study question</h3><select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-3 rounded-2xl bg-white text-slate-950"><option>Passage Explanation</option><option>Topical Bible Study</option><option>Bible Character Study</option><option>Cross References</option><option>Life Application</option><option>Prayer and Devotion Guide</option></select><textarea value={question} onChange={e => setQuestion(e.target.value)} className="w-full min-h-32 rounded-3xl bg-white text-slate-950 p-4 outline-none" placeholder="Ask: What does Romans 8 mean? Give me verses on anxiety. Explain Joseph's story." /><div className="flex flex-wrap gap-2">{prompts.map(p => <button key={p} onClick={() => setQuestion(p)} className="rounded-full bg-white/10 border border-white/20 px-3 py-2 text-xs font-bold">{p}</button>)}</div><div className="flex flex-wrap gap-2"><button onClick={askCompanion} disabled={loading} className="rounded-2xl bg-white text-slate-950 px-5 py-3 font-black disabled:opacity-50">{loading ? 'Studying...' : 'Generate Bible Study'}</button><button onClick={() => copyText(answer)} className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 font-black">Copy</button><button onClick={() => speak(answer.slice(0, 900))} className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 font-black">Audio</button><button onClick={saveStudy} className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 font-black">Save Study</button></div>{error && <p className="text-xs text-amber-200">{error}</p>}</section>
    {answer && <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-100 font-sans">{answer}</pre></article>}
    <section><h3 className="font-black text-xl mb-4">Saved AI Bible Studies</h3>{saved.length === 0 ? <div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center text-slate-500">No saved AI studies yet.</div> : <div className="grid md:grid-cols-2 gap-4">{saved.map(n => <article key={n.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-slate-500">{new Date(n.createdAt).toLocaleDateString()} • {n.mode}</p><h3 className="font-black text-lg mt-1">{n.question}</h3></div><button onClick={() => setSaved(saved.filter(x => x.id !== n.id))} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><Trash2 /></button></div><pre className="mt-3 whitespace-pre-wrap text-xs leading-6 font-sans line-clamp-6">{n.answer}</pre></article>)}</div>}</section>
  </main></Shell>;
}

function AssistantPage() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const local = useMemo(() => searchTopics(input, topics).slice(0, 5), [input]);
  async function ask() {
    if (!input.trim()) return;
    setLoading(true); setAnswer(''); setError('');
    try {
      const r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ situation: input, topics, mode: 'guidance' }) });
      const d = await r.json();
      if (d.answer) setAnswer(d.answer); else if (d.demo) setError(`${d.message} Recommended topics: ${local.map(t => t.title).join(', ') || 'Faith, Prayer, Peace, Wisdom'}.`); else setError(d.error || 'AI service returned no answer.');
    } catch (e) { setError('AI service unavailable. Check Vercel Function logs and OPENAI_API_KEY.'); }
    setLoading(false);
  }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="AI Scripture Finder" sub="Describe your situation and receive real OpenAI-powered scripture guidance, prayer points, devotional direction, and a reading plan." /><div className="rounded-[2rem] bg-white dark:bg-slate-900 p-5 border dark:border-slate-800 shadow-soft"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Example: I lost my job and I am worried about paying rent." className="w-full min-h-36 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-white" /><button onClick={ask} disabled={loading} className="mt-4 w-full rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-3 flex items-center justify-center gap-2 disabled:opacity-60"><Sparkles /> {loading ? 'Finding scriptures...' : 'Find Scriptures'}</button></div>{local.length > 0 && <section><h3 className="font-black mb-3">Local Recommendations</h3><div className="grid md:grid-cols-3 gap-4">{local.map(t => <TopicCard key={t.id} topic={t} />)}</div></section>}{error && <section className="rounded-3xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 p-5 shadow-sm whitespace-pre-wrap leading-7 flex gap-3"><AlertCircle className="shrink-0" /><div><h3 className="font-black mb-2">AI Setup / Service Message</h3>{error}</div></section>}{answer && <section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm whitespace-pre-wrap leading-7"><h3 className="font-black mb-3">AI Guidance</h3>{answer}</section>}</main></Shell>;
}

function ProfilePage() {
  const [bookmarks] = useLocal('s4es-bookmarks', []);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.email) setEmail(data.session.user.email);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user?.email) setEmail(s.user.email);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    async function loadProfile() {
      if (!supabase || !session?.user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      setDisplayName(data?.display_name || session.user.email?.split('@')[0] || '');
    }
    loadProfile();
  }, [session?.user?.id]);
  function validateAuthFields(needsPassword = true) {
    if (!supabase) return 'Add Supabase keys in Vercel environment variables.';
    if (!email.trim()) return 'Enter your email address.';
    if (needsPassword && password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }
  async function signUp() {
    const err = validateAuthFields(true); if (err) return setAuthStatus(err);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: displayName || email.split('@')[0] } } });
    setAuthStatus(error ? error.message : 'Account created. If email confirmation is enabled, check your inbox; otherwise you can sign in now.');
  }
  async function signIn() {
    const err = validateAuthFields(true); if (err) return setAuthStatus(err);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setAuthStatus(error ? error.message : 'Signed in successfully.');
  }
  async function sendReset() {
    const err = validateAuthFields(false); if (err) return setAuthStatus(err);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + '/profile' });
    setAuthStatus(error ? error.message : 'Password reset email sent. Check your inbox.');
  }
  async function updatePassword() {
    if (!supabase || !session?.user) return setAuthStatus('Sign in first.');
    if (password.length < 6) return setAuthStatus('New password must be at least 6 characters.');
    const { error } = await supabase.auth.updateUser({ password });
    setAuthStatus(error ? error.message : 'Password updated successfully.');
  }
  async function saveProfile() {
    if (!supabase || !session?.user) return setProfileStatus('Sign in first to save your profile.');
    const { error } = await supabase.from('profiles').upsert({ id: session.user.id, email: session.user.email, display_name: displayName || session.user.email?.split('@')[0] || 'Member' });
    setProfileStatus(error ? error.message : 'Profile saved successfully.');
  }
  async function signOut() { await supabase.auth.signOut(); setSession(null); setAuthStatus('Signed out.'); }
  function clearDeviceData() {
    if (!confirm('Clear local app data on this device? Cloud data in Supabase will not be deleted.')) return;
    Object.keys(localStorage).filter(k => k.startsWith('s4es-')).forEach(k => localStorage.removeItem(k));
    location.reload();
  }
  const [syncStatus, setSyncStatus] = useState('Cloud sync is ready after sign-in.');
  function readLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  async function syncToCloud() {
    if (!supabase || !session?.user) return alert('Sign in first to sync your data.');
    const user = session.user;
    setSyncStatus('Syncing local data to Supabase...');
    try {
      await supabase.from('profiles').upsert({ id: user.id, email: user.email, display_name: displayName || user.email?.split('@')[0] || 'Member' });
      const journal = readLocal('s4es-prayer-journal', []);
      if (journal.length) await supabase.from('journal_entries').upsert(journal.map(e => ({ id: String(e.id).length > 20 ? e.id : undefined, user_id: user.id, title: e.title || e.category || 'Prayer Entry', content: [e.body, e.scripture ? `Scripture: ${e.scripture}` : '', e.importance ? `Importance: ${e.importance}` : ''].filter(Boolean).join('\n\n'), category: e.category || 'Direction', status: (e.status || 'waiting').toLowerCase(), is_answered: (e.status || '').toLowerCase() === 'answered' || !!e.answered, answered_at: e.answeredAt || null, testimony: e.testimony || null })).filter(Boolean));
      const favs = readLocal('s4es-favorites', []);
      if (favs.length) await supabase.from('favorites').upsert(favs.map(f => ({ user_id: user.id, item_type: f.type || 'verse', item_id: String(f.id || f.ref || f.title), title: f.title || f.ref || 'Saved Item', reference: f.ref || null, content: f.text || f.content || null })));
      const completed = readLocal('s4es-completed-devotions', []);
      if (completed.length) await supabase.from('devotion_progress').upsert(completed.map(day => ({ user_id: user.id, devotion_day: Number(day) })));
      const notes = readLocal('s4es-study-notes', []);
      const sermons = readLocal('s4es-sermon-outlines', []);
      const companion = readLocal('s4es-ai-study-companion-notes', []);
      const allStudyNotes = [
        ...notes.map(n => ({ user_id: user.id, title: n.title || 'Study Note', passage: n.passage || '', observation: n.observation || '', interpretation: n.interpretation || '', application: n.application || '', prayer: n.prayer || '' })),
        ...sermons.map(n => ({ user_id: user.id, title: 'Sermon: ' + (n.title || n.topic || 'Untitled Sermon'), passage: n.scripture || n.passage || '', observation: n.context || n.bigIdea || '', interpretation: Array.isArray(n.points) ? n.points.join('\n') : (n.outline || ''), application: n.applications || n.application || '', prayer: n.closingPrayer || n.prayer || '' })),
        ...companion.map(n => ({ user_id: user.id, title: 'AI Study: ' + (n.question || n.title || 'Bible Study'), passage: n.passage || '', observation: n.answer || n.content || '', interpretation: '', application: '', prayer: '' }))
      ];
      if (allStudyNotes.length) await supabase.from('study_notes').upsert(allStudyNotes);
      const r = readLocal('s4es-reminders', null);
      if (r) await supabase.from('reminders').upsert([
        { user_id: user.id, title: 'Morning Devotion', time: r.morning || '07:00', frequency: 'daily', enabled: !!r.enabled },
        { user_id: user.id, title: 'Noon Prayer', time: r.noon || '12:00', frequency: 'daily', enabled: !!r.enabled },
        { user_id: user.id, title: 'Night Reflection', time: r.night || '21:00', frequency: 'daily', enabled: !!r.enabled }
      ]);
      setSyncStatus('Cloud sync complete. Your journal, favorites, reminders, progress, Bible study notes, sermons, and AI study notes were sent to Supabase.');
    } catch (e) { setSyncStatus('Cloud sync error: ' + (e.message || 'Unknown error')); }
  }
  async function pullFromCloud() {
    if (!supabase || !session?.user) return alert('Sign in first to pull your cloud data.');
    const user = session.user;
    setSyncStatus('Pulling cloud data from Supabase...');
    try {
      const [j, f, d, n, r] = await Promise.all([
        supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('devotion_progress').select('*').eq('user_id', user.id),
        supabase.from('study_notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('reminders').select('*').eq('user_id', user.id)
      ]);
      if (j.data) localStorage.setItem('s4es-prayer-journal', JSON.stringify(j.data.map(e => ({ id: e.id, title: e.title, body: e.content || '', category: e.category || 'Direction', status: e.is_answered ? 'Answered' : (e.status || 'Waiting'), createdAt: e.created_at, answeredAt: e.answered_at }))));
      if (f.data) localStorage.setItem('s4es-favorites', JSON.stringify(f.data.map(x => ({ id: x.item_id, type: x.item_type, title: x.title, ref: x.reference, text: x.content, savedAt: x.created_at }))));
      if (d.data) localStorage.setItem('s4es-completed-devotions', JSON.stringify(d.data.map(x => x.devotion_day).sort((a, b) => a - b)));
      if (n.data) localStorage.setItem('s4es-study-notes', JSON.stringify(n.data.map(x => ({ id: x.id, title: x.title, passage: x.passage, observation: x.observation, interpretation: x.interpretation, application: x.application, prayer: x.prayer, createdAt: x.created_at }))));
      if (r.data?.length) {
        const settings = { morning: '07:00', noon: '12:00', night: '21:00', focus: 'Daily Morning Devotion', enabled: true };
        r.data.forEach(x => { if (x.title?.includes('Morning')) settings.morning = x.time; if (x.title?.includes('Noon')) settings.noon = x.time; if (x.title?.includes('Night')) settings.night = x.time; settings.enabled = x.enabled; });
        localStorage.setItem('s4es-reminders', JSON.stringify(settings));
      }
      setSyncStatus('Cloud data pulled successfully. Refreshing app...');
      setTimeout(() => location.reload(), 800);
    } catch (e) { setSyncStatus('Pull error: ' + (e.message || 'Unknown error')); }
  }
  const saved = verses.filter(v => bookmarks.includes(v.id));
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Profile, Account & Cloud Sync" sub="V6.5: production-ready sign-in, profile settings, password reset, account controls, and Supabase cloud sync." />
    <div className="grid lg:grid-cols-3 gap-4">
      <section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm lg:col-span-1"><h3 className="font-black flex gap-2"><ShieldCheck /> Member Access</h3>{session ? <div className="mt-4 space-y-3"><div className="h-16 w-16 rounded-3xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-2xl">{(displayName || session.user.email || 'M')[0].toUpperCase()}</div><p className="text-sm">Signed in as <b>{session.user.email}</b></p><p className="text-xs text-slate-500">User ID: {session.user.id}</p><button onClick={signOut} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-bold flex gap-2"><LogOut />Sign out</button></div> : <div className="mt-4 space-y-3"><p className="text-sm text-slate-600 dark:text-slate-300">{supabaseEnabled ? 'Create your account or sign in. Password must be at least 6 characters.' : 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'}</p><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name (optional)" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><div className="flex flex-wrap gap-2"><button onClick={signIn} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-bold flex gap-2"><LogIn />Sign in</button><button onClick={signUp} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold">Sign up</button><button onClick={sendReset} className="rounded-2xl bg-amber-100 dark:bg-amber-950 px-4 py-2 font-bold">Reset password</button></div>{authStatus && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{authStatus}</p>}</div>}</section>
      <section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm lg:col-span-2"><h3 className="font-black flex gap-2"><User /> Profile Settings</h3><div className="grid md:grid-cols-2 gap-3 mt-4"><input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></div><div className="flex flex-wrap gap-2 mt-3"><button onClick={saveProfile} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-bold">Save profile</button><button onClick={updatePassword} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold">Update password to typed password</button><button onClick={clearDeviceData} className="rounded-2xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 px-4 py-2 font-bold flex gap-2"><Trash2 /> Clear device data</button></div><p className="text-sm font-semibold text-slate-500 mt-3">{profileStatus}</p><p className="text-xs text-slate-500 mt-2">Account deletion requires a secure server-side admin function. For now, sign out and clear device data, or delete the user from Supabase Authentication dashboard.</p></section>
    </div>
    <section className="grid md:grid-cols-3 gap-4"><section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black flex gap-2"><Bookmark /> Saved Scriptures</h3><p className="text-3xl font-black mt-4">{saved.length}</p><p className="text-sm text-slate-500">Saved on this device and ready for Supabase cloud sync.</p></section><section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black flex gap-2"><ShieldCheck /> Auth Status</h3><p className="text-sm mt-3">{session ? 'Signed in and cloud sync ready.' : 'Not signed in.'}</p><p className="text-xs text-slate-500 mt-2">Email confirmation can be controlled in Supabase Auth settings.</p></section><section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black flex gap-2"><Database /> Supabase</h3><p className="text-sm mt-3">{supabaseEnabled ? 'Environment variables detected.' : 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'}</p></section></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black text-xl flex gap-2"><Database /> Cloud Sync Center</h3><p className="text-sm text-slate-600 dark:text-slate-300">Sync local app data with your Supabase account: Prayer Journal, Favorites, Reminders, Devotion Progress, Bible Study Notes, Sermon outlines, and AI Study Companion notes.</p><div className="flex flex-wrap gap-3"><button onClick={syncToCloud} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Push Local Data to Cloud</button><button onClick={pullFromCloud} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Pull Cloud Data to This Device</button></div><p className="text-sm font-semibold text-slate-500">{syncStatus}</p></section><section className="grid md:grid-cols-2 gap-4">{saved.slice(0, 20).map(v => <VerseCardLite key={v.id} verse={v} />)}</section></main></Shell>;
}

function JournalPage() {
  const [entries, setEntries] = useLocal('s4es-prayer-journal', []);
  const [form, setForm] = useState({ title: '', body: '', category: 'Direction', status: 'Waiting', importance: 'Normal', scripture: '' });
  const [filter, setFilter] = useState('All');
  function addEntry() {
    if (!form.title.trim() && !form.body.trim()) return;
    const entry = { id: Date.now().toString(), ...form, title: form.title.trim() || form.category, body: form.body.trim(), createdAt: new Date().toISOString(), answeredAt: form.status === 'Answered' ? new Date().toISOString() : null };
    setEntries([entry, ...entries]);
    setForm({ title: '', body: '', category: 'Direction', status: 'Waiting', importance: 'Normal', scripture: '' });
  }
  function updateStatus(id, status) { setEntries(entries.map(e => e.id === id ? { ...e, status, answered: status === 'Answered', answeredAt: status === 'Answered' ? (e.answeredAt || new Date().toISOString()) : null } : e)); }
  function removeEntry(id) { setEntries(entries.filter(e => e.id !== id)); }
  const normalized = entries.map(e => ({ ...e, status: e.status || (e.answered ? 'Answered' : 'Waiting') }));
  const answered = normalized.filter(e => e.status === 'Answered').length;
  const ongoing = normalized.filter(e => e.status === 'Ongoing').length;
  const waiting = normalized.filter(e => e.status === 'Waiting').length;
  const shown = filter === 'All' ? normalized : normalized.filter(e => e.status === filter || e.category === filter);
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Prayer Journal & Testimonies" sub="Organize requests, track ongoing prayers, and record answered-prayer testimonies. Saved locally now; Supabase sync can be added later." />
    <section className="grid md:grid-cols-4 gap-4"><DashboardCard to="/journal" icon={<PenLine />} title={`${entries.length} Entries`} sub="All prayers and reflections" /><DashboardCard to="/journal" icon={<Clock />} title={`${waiting} Waiting`} sub="Requests before God" /><DashboardCard to="/journal" icon={<HeartHandshake />} title={`${ongoing} Ongoing`} sub="Keep praying faithfully" /><DashboardCard to="/journal" icon={<CheckCircle2 />} title={`${answered} Answered`} sub="Testimonies to remember" /></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-soft space-y-3"><h3 className="font-black flex items-center gap-2"><PenLine />New Prayer Entry</h3><div className="grid md:grid-cols-4 gap-3"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title, e.g. Job interview" className="md:col-span-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none" /><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none">{prayerCategories.map(c => <option key={c}>{c}</option>)}</select><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none">{prayerStatuses.map(c => <option key={c}>{c}</option>)}</select></div><div className="grid md:grid-cols-2 gap-3"><input value={form.scripture} onChange={e => setForm({ ...form, scripture: e.target.value })} placeholder="Scripture, e.g. Philippians 4:6-7" className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none" /><select value={form.importance} onChange={e => setForm({ ...form, importance: e.target.value })} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none"><option>Normal</option><option>Important</option><option>Urgent</option></select></div><textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Write the prayer, situation, testimony, or reflection here..." className="w-full min-h-32 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none" /><button onClick={addEntry} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Save Entry</button></section>
    <section className="flex flex-wrap gap-2"><button onClick={() => setFilter('All')} className={cls('rounded-full px-4 py-2 text-xs font-black', filter === 'All' ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white dark:bg-slate-900 border dark:border-slate-800')}>All</button>{[...prayerStatuses, ...prayerCategories].map(f => <button key={f} onClick={() => setFilter(f)} className={cls('rounded-full px-4 py-2 text-xs font-black', filter === f ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white dark:bg-slate-900 border dark:border-slate-800')}><Filter size={12} className="inline mr-1" />{f}</button>)}</section>
    <section className="space-y-4">{shown.length === 0 ? <div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center text-slate-500">No entries in this view yet.</div> : shown.map(e => <article key={e.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-slate-500">{e.category} • {e.status} • {e.importance} • {new Date(e.createdAt).toLocaleDateString()}</p><h3 className="font-black text-xl mt-1">{e.title}</h3>{e.scripture && <p className="text-xs font-bold text-slate-500 mt-1">Scripture: {e.scripture}</p>}</div><div className="flex gap-2"><select value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">{prayerStatuses.map(s => <option key={s}>{s}</option>)}</select><button onClick={() => removeEntry(e.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800" title="Delete"><Trash2 /></button></div></div><p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-100 whitespace-pre-wrap">{e.body}</p>{e.status === 'Answered' && <p className="mt-3 inline-flex rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-200 px-3 py-1 text-xs font-black">Answered {e.answeredAt ? `on ${new Date(e.answeredAt).toLocaleDateString()}` : ''}</p>}</article>)}</section></main></Shell>;
}

function RemindersPage() {
  const [settings, setSettings] = useLocal('s4es-reminders', { morning: '07:00', noon: '12:00', night: '21:00', focus: 'Daily Morning Devotion', enabled: false });
  const [status, setStatus] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  async function requestPermission() {
    if (typeof Notification === 'undefined') { setStatus('unsupported'); return; }
    const p = await Notification.requestPermission();
    setStatus(p);
    setSettings({ ...settings, enabled: p === 'granted' });
    if (p === 'granted') new Notification('Scriptures for Every Situation', { body: 'Prayer reminders are enabled on this browser.' });
  }
  function testNotification(label) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification(`${label} Prayer Reminder`, { body: `Your focus: ${settings.focus}. Open the app for scripture and prayer.` });
    else alert('Please enable browser notifications first.');
  }
  const times = [['morning', 'Morning devotion'], ['noon', 'Noon prayer'], ['night', 'Night reflection']];
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Prayer & Devotion Reminders" sub="Prepare a daily rhythm of morning devotion, noon prayer, and night reflection. Browser notifications work where supported; backend push notifications can come later." />
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black flex items-center gap-2"><Bell />Reminder Settings</h3><div className="grid md:grid-cols-3 gap-4">{times.map(([key, label]) => <label key={key} className="block"><span className="text-xs font-bold text-slate-500">{label}</span><input type="time" value={settings[key]} onChange={e => setSettings({ ...settings, [key]: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></label>)}</div><label className="block"><span className="text-xs font-bold text-slate-500">Prayer focus</span><input value={settings.focus} onChange={e => setSettings({ ...settings, focus: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></label><div className="flex flex-wrap gap-3"><button onClick={requestPermission} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Enable Notifications</button>{times.map(([key, label]) => <button key={key} onClick={() => testNotification(label)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Test {label}</button>)}</div><p className="text-sm text-slate-500">Permission status: <b>{status}</b>. Morning: <b>{settings.morning}</b>. Noon: <b>{settings.noon}</b>. Night: <b>{settings.night}</b>. Focus: <b>{settings.focus}</b>.</p></section>
    <section className="grid md:grid-cols-3 gap-4"><Link to="/devotions" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><Sunrise /><h3 className="font-black mt-3">Morning Devotions</h3><p className="text-sm text-slate-500 mt-2">Open the 365-day devotional library.</p></Link><Link to="/assistant" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><Sparkles /><h3 className="font-black mt-3">Ask AI for a Prayer Plan</h3><p className="text-sm text-slate-500 mt-2">Generate scripture-centered guidance for today.</p></Link><Link to="/journal" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><HeartHandshake /><h3 className="font-black mt-3">Record Testimony</h3><p className="text-sm text-slate-500 mt-2">Save what God has done and mark prayers answered.</p></Link></section></main></Shell>;
}

function InstallBanner() {
  const [deferred, setDeferred] = useState(null);
  useEffect(() => { const h = e => { e.preventDefault(); setDeferred(e); }; window.addEventListener('beforeinstallprompt', h); return () => window.removeEventListener('beforeinstallprompt', h); }, []);
  return <div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm flex items-center justify-between gap-4"><div><h3 className="font-black flex gap-2"><Download /> Install on Mobile</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">On Chrome/Android tap install. On iPhone Safari tap Share → Add to Home Screen.</p></div>{deferred && <button onClick={() => deferred.prompt()} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-bold">Install</button>}</div>;
}

function HabitPage() {
  const todayKey = dateKey();
  const [habit, setHabit] = useLocal('s4es-daily-habits', { checks: {}, recoveryNotes: [], lastSummaryViewed: null });
  const [reminders, setReminders] = useLocal('s4es-reminders', { morning: '07:00', noon: '12:00', night: '21:00', focus: 'Daily Morning Devotion', enabled: false });
  const [completed] = useLocal('s4es-completed-devotions', []);
  const today = habit.checks?.[todayKey] || { morning: false, noon: false, night: false, gratitude: '', lesson: '', prayer: '' };
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = dateKey(d);
    return { key, data: habit.checks?.[key] || {} };
  }).reverse();
  const score = ['morning', 'noon', 'night'].filter(k => today[k]).length;
  const weekScore = last7.reduce((sum, d) => sum + ['morning', 'noon', 'night'].filter(k => d.data[k]).length, 0);
  const streak = calcStreak(completed);
  const devotion = devotions[(dayOfYear() - 1) % devotions.length];
  function updateToday(patch) { setHabit({ ...habit, checks: { ...(habit.checks || {}), [todayKey]: { ...today, ...patch } } }); }
  async function enableNotifications() {
    if (typeof Notification === 'undefined') return alert('This browser does not support notifications.');
    const p = await Notification.requestPermission();
    setReminders({ ...reminders, enabled: p === 'granted' });
    if (p === 'granted') new Notification('Daily habit reminders enabled', { body: 'Your morning, noon, and night rhythm is ready while this browser supports notifications.' });
  }
  function test(label) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification(`${label} Habit Check-in`, { body: `Open Scriptures for Every Situation for ${label.toLowerCase()} prayer and devotion.` });
    else alert('Please enable notifications first.');
  }
  function addRecoveryNote() {
    const note = prompt('Write a short recovery note or prayer for restarting your habit today:');
    if (note) setHabit({ ...habit, recoveryNotes: [{ note, at: new Date().toISOString() }, ...(habit.recoveryNotes || [])] });
  }
  function applyHabitPlan(plan) {
    const plans = {
      gentle: { morning: '07:30', noon: '12:30', night: '21:00', focus: 'Gentle Grace Rhythm' },
      growth: { morning: '06:30', noon: '12:00', night: '20:30', focus: 'Spiritual Growth Rhythm' },
      ministry: { morning: '05:30', noon: '13:00', night: '22:00', focus: 'Ministry & Intercession Rhythm' }
    };
    setReminders({ ...reminders, ...plans[plan], enabled: reminders.enabled });
  }
  function addQuickPrayer(text) {
    updateToday({ prayer: [today.prayer, text].filter(Boolean).join('\n\n') });
  }
  function exportWeeklySummary() {
    const summary = last7.map(d => `${d.key}: ${['morning','noon','night'].filter(k => d.data[k]).length}/3`).join('\n');
    const text = `Weekly Spiritual Growth Summary\n\n${summary}\n\nTotal: ${weekScore}/21\nCurrent streak: ${streak.current}\nLongest streak: ${streak.longest}`;
    navigator.clipboard?.writeText(text);
    alert('Weekly summary copied to clipboard.');
  }
  function resetToday() {
    if (confirm('Clear today\'s habit check-ins and reflections?')) updateToday({ morning: false, noon: false, night: false, gratitude: '', prayer: '', sabbath: false });
  }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Notifications & Daily Habit System" sub="V6.7.1 adds guided habit plans, quick prayer prompts, weekly export, Sabbath/rest mode, and stronger morning/noon/night spiritual rhythm tools." />
    <section className="grid md:grid-cols-4 gap-4"><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Today's Check-ins</p><p className="text-3xl font-black mt-2">{score}/3</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Weekly Rhythm</p><p className="text-3xl font-black mt-2">{weekScore}/21</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Devotion Streak</p><p className="text-3xl font-black mt-2">{streak.current}</p></div><Link to={`/devotions/${devotion.day}`} className="rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-5 shadow-sm"><p className="text-xs font-bold opacity-70">Today's Devotion</p><p className="text-2xl font-black mt-2">Day {devotion.day}</p></Link></section>
    <section className="grid md:grid-cols-3 gap-4">{[['morning','Morning Devotion','Begin with Scripture and surrender the day.'], ['noon','Noon Prayer','Pause, pray, and reset your heart.'], ['night','Night Reflection','Review the day with gratitude and repentance.']].map(([key,title,sub]) => <article key={key} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3"><div className="flex items-center justify-between"><h3 className="font-black text-xl">{title}</h3>{today[key] ? <CheckCircle2 className="text-emerald-500" /> : <Clock className="text-slate-400" />}</div><p className="text-sm text-slate-600 dark:text-slate-300">{sub}</p><button onClick={() => updateToday({ [key]: !today[key] })} className={cls('rounded-2xl px-5 py-3 font-black w-full', today[key] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950')}>{today[key] ? 'Completed' : 'Mark Complete'}</button></article>)}</section>
    <section className="grid md:grid-cols-3 gap-4"><article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3"><h3 className="font-black text-xl flex gap-2"><Flame /> Habit Plans</h3><p className="text-sm text-slate-600 dark:text-slate-300">Apply a ready-made daily rhythm for different seasons of life.</p><div className="grid gap-2"><button onClick={() => applyHabitPlan('gentle')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Gentle Grace Plan</button><button onClick={() => applyHabitPlan('growth')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Spiritual Growth Plan</button><button onClick={() => applyHabitPlan('ministry')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Ministry & Intercession Plan</button></div></article><article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3"><h3 className="font-black text-xl flex gap-2"><HeartHandshake /> Quick Prayers</h3><p className="text-sm text-slate-600 dark:text-slate-300">Add a guided prayer into today’s reflection.</p><div className="grid gap-2"><button onClick={() => addQuickPrayer('Lord, order my steps today and help me walk in wisdom, obedience, and peace.')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Direction prayer</button><button onClick={() => addQuickPrayer('Father, strengthen my faith, calm my heart, and help me trust Your promises today.')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Faith prayer</button><button onClick={() => addQuickPrayer('Lord, help me end today with gratitude, repentance, and renewed hope in Christ.')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black text-left">Night reflection prayer</button></div></article><article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3"><h3 className="font-black text-xl flex gap-2"><ListChecks /> Habit Controls</h3><p className="text-sm text-slate-600 dark:text-slate-300">Manage today’s rhythm and export the week’s summary.</p><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!today.sabbath} onChange={e => updateToday({ sabbath: e.target.checked })} /> Sabbath/rest mode</label><div className="flex flex-wrap gap-2"><button onClick={exportWeeklySummary} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-3 font-black">Copy Weekly Summary</button><button onClick={resetToday} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black">Reset Today</button></div>{today.sabbath && <p className="text-sm rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3">Rest mode is on: today’s focus is worship, gratitude, rest, and renewal rather than pressure.</p>}</article></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black text-xl flex gap-2"><Bell /> Reminder Times</h3><div className="grid md:grid-cols-3 gap-4">{[['morning','Morning'], ['noon','Noon'], ['night','Night']].map(([key,label]) => <label key={key}><span className="text-xs font-bold text-slate-500">{label}</span><input type="time" value={reminders[key] || ''} onChange={e => setReminders({ ...reminders, [key]: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></label>)}</div><label className="block"><span className="text-xs font-bold text-slate-500">Daily focus</span><input value={reminders.focus || ''} onChange={e => setReminders({ ...reminders, focus: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></label><div className="flex flex-wrap gap-2"><button onClick={enableNotifications} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Enable Notifications</button><button onClick={() => test('Morning')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Test Morning</button><button onClick={() => test('Noon')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Test Noon</button><button onClick={() => test('Night')} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Test Night</button></div><p className="text-sm text-slate-500">Browser notification status: <b>{typeof Notification === 'undefined' ? 'unsupported' : Notification.permission}</b>. For true push notifications while the app is closed, connect a backend notification service later.</p></section>
    <section className="grid md:grid-cols-2 gap-4"><article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm space-y-3"><h3 className="font-black text-xl flex gap-2"><Trophy /> Weekly Spiritual Growth Summary</h3><p className="text-sm text-slate-600 dark:text-slate-300">You completed {weekScore} of 21 possible habit check-ins this week. Current devotion streak: {streak.current}. Longest streak: {streak.longest}.</p><div className="grid grid-cols-7 gap-1">{last7.map(d => <div key={d.key} className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 text-center"><p className="text-[10px] font-bold text-slate-500">{d.key.slice(5)}</p><p className="font-black">{['morning','noon','night'].filter(k => d.data[k]).length}</p></div>)}</div></article><article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm space-y-3"><h3 className="font-black text-xl flex gap-2"><HeartHandshake /> Missed-Day Recovery</h3><p className="text-sm text-slate-600 dark:text-slate-300">Missing a day is not failure. Restart with grace, prayer, and one small act of obedience today.</p><button onClick={addRecoveryNote} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Write Recovery Prayer</button>{(habit.recoveryNotes || []).slice(0,3).map((n,i) => <p key={i} className="text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 p-3">{n.note}</p>)}</article></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black text-xl">Daily Reflection</h3><textarea value={today.gratitude || ''} onChange={e => updateToday({ gratitude: e.target.value })} placeholder="What are you thankful for today?" className="w-full min-h-24 rounded-3xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-4 outline-none" /><textarea value={today.prayer || ''} onChange={e => updateToday({ prayer: e.target.value })} placeholder="Write a short prayer or lesson from today." className="w-full min-h-24 rounded-3xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-4 outline-none" /></section>
  </main></Shell>;
}

function ProgressPage() {
  const [completed, setCompleted] = useLocal('s4es-completed-devotions', []);
  const completedSet = new Set(completed);
  const today = devotions[(dayOfYear() - 1) % devotions.length];
  const next = devotions.find(d => !completedSet.has(d.day)) || today;
  const pct = Math.round((completed.length / devotions.length) * 100);
  const streak = calcStreak(completed);
  const recent = [...completed].slice(-10).reverse();
  function resetProgress() { if (confirm('Reset all devotion progress on this device?')) setCompleted([]); }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Devotion Progress & Streaks" sub="Track your devotional journey on this device. Supabase sync can be added later for cross-device history." /><section className="grid md:grid-cols-5 gap-4"><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Current Streak</p><p className="text-3xl font-black mt-2">{streak.current}</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Longest Streak</p><p className="text-3xl font-black mt-2">{streak.longest}</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Completed</p><p className="text-3xl font-black mt-2">{completed.length}</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Remaining</p><p className="text-3xl font-black mt-2">{365 - completed.length}</p></div><div className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">Progress</p><p className="text-3xl font-black mt-2">{pct}%</p></div><Link to={`/devotions/${next.day}`} className="rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-5 shadow-sm"><p className="text-xs font-bold opacity-70">Continue With</p><p className="text-2xl font-black mt-2">Day {next.day}</p></Link></section><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black mb-3">Completion Bar</h3><div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-slate-950 dark:bg-white" style={{ width: `${pct}%` }} /></div><p className="text-sm text-slate-500 mt-3">Mark devotions complete as you read. This gives users a visible habit loop and prepares the app for future streak notifications.</p></section><section className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm"><h3 className="font-black mb-3">Recent Completed Days</h3>{recent.length ? <div className="flex flex-wrap gap-2">{recent.map(day => <Link key={day} to={`/devotions/${day}`} className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-200 px-3 py-2 text-xs font-black">Day {day}</Link>)}</div> : <p className="text-sm text-slate-500">No completed devotions yet.</p>}</div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm"><h3 className="font-black mb-3">Progress Actions</h3><div className="flex flex-wrap gap-2"><Link to={`/devotions/${today.day}`} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-3 font-black">Open Today's Devotion</Link><button onClick={resetProgress} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 font-black">Reset Progress</button></div></div></section></main></Shell>;
}


function FavoritesPage() {
  const [favorites, setFavorites] = useLocal('s4es-favorites', []);
  function remove(id) { setFavorites(favorites.filter(f => f.id !== id)); }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Favorites" sub="Saved verses and devotion moments on this device. Supabase sync can be added later." />
    {favorites.length === 0 ? <section className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 text-center text-slate-500">No favorites yet. Use the Save button on scripture cards.</section> : <section className="grid md:grid-cols-2 gap-4">{favorites.map(f => <article key={f.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-xs font-bold text-slate-500">{f.type} • {new Date(f.savedAt).toLocaleDateString()}</p><h3 className="font-black text-xl mt-1">{f.title}</h3>{f.ref && <p className="text-xs font-bold text-slate-500 mt-1">{f.ref}</p>}</div><button onClick={() => remove(f.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><Trash2 /></button></div><p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-100 whitespace-pre-wrap line-clamp-6">{f.text}</p></article>)}</section>}
  </main></Shell>;
}



function PersonalDashboard() {
  const [setup] = useLocal('s4es-onboarding', { completed: false, interests: [], goal: 'Grow daily', reminder: '07:00' });
  const [progress] = useLocal('s4es-devotion-progress', []);
  const [journal] = useLocal('s4es-journal', []);
  const [favorites] = useLocal('s4es-favorites', []);
  const lastDone = progress?.length ? Math.max(...progress) : 0;
  const nextDay = Math.min(365, lastDone + 1 || dayOfYear());
  const interests = setup.interests?.length ? setup.interests.slice(0, 5) : ['Faith', 'Prayer', 'Wisdom'];
  return <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-5">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div><p className="text-xs font-black uppercase tracking-wider text-slate-500">Personal dashboard</p><h3 className="text-2xl font-black mt-1">Continue where you left off</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Your setup, progress, prayers, favorites, and next devotion in one compact place.</p></div>
      <Link to="/onboarding" className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black text-center">{setup.completed ? 'Update Setup' : 'Start Setup'}</Link>
    </div>
    <div className="grid md:grid-cols-4 gap-4">
      <DashboardCard to={`/devotions/${nextDay}`} icon={<Sunrise size={30} />} title={`Day ${nextDay}`} sub="Continue devotion" />
      <DashboardCard to="/journal" icon={<PenLine size={30} />} title={`${journal.length} Prayers`} sub="Journal entries" />
      <DashboardCard to="/favorites" icon={<Star size={30} />} title={`${favorites.length} Favorites`} sub="Saved scriptures" />
      <DashboardCard to="/help" icon={<HeartHandshake size={30} />} title="Need help?" sub="FAQ and launch guidance" />
    </div>
    <div className="flex flex-wrap gap-2">{interests.map(x => <Link key={x} to={`/topics?interest=${encodeURIComponent(x)}`} className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-black">{x}</Link>)}</div>
  </section>;
}

function OnboardingPage() {
  const options = ['Faith', 'Prayer', 'Wisdom', 'Healing', 'Direction', 'Career', 'Family', 'Finances', 'Bible Study', 'Sermons', 'Devotions', 'Peace'];
  const [setup, setSetup] = useLocal('s4es-onboarding', { completed: false, interests: [], goal: 'Grow daily', reminder: '07:00' });
  function toggle(item) {
    const has = setup.interests.includes(item);
    setSetup({ ...setup, interests: has ? setup.interests.filter(x => x !== item) : [...setup.interests, item] });
  }
  function complete() { setSetup({ ...setup, completed: true, completedAt: new Date().toISOString() }); }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Personalize Your Walk" sub="Choose your spiritual interests and daily rhythm so the home dashboard becomes more useful." />
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-5">
      <div><h3 className="font-black text-xl">What do you want to focus on?</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Select all that apply.</p></div>
      <div className="flex flex-wrap gap-2">{options.map(item => <button key={item} onClick={() => toggle(item)} className={cls('rounded-full px-4 py-2 text-sm font-black border', setup.interests.includes(item) ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700')}>{item}</button>)}</div>
      <div className="grid md:grid-cols-2 gap-4"><label><span className="text-xs font-bold text-slate-500">Main goal</span><select value={setup.goal} onChange={e => setSetup({ ...setup, goal: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option>Grow daily</option><option>Study the Bible deeply</option><option>Build prayer consistency</option><option>Prepare sermons/teachings</option><option>Find Scripture for situations</option></select></label><label><span className="text-xs font-bold text-slate-500">Preferred devotion time</span><input type="time" value={setup.reminder} onChange={e => setSetup({ ...setup, reminder: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /></label></div>
      <button onClick={complete} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-3 font-black">Save Personalization</button>
      {setup.completed && <p className="text-sm font-bold text-emerald-600">Setup saved. Your dashboard has been personalized.</p>}
    </section>
  </main></Shell>;
}

function HelpPage() {
  const faqs = [
    ['How do I install the app?', 'On Android/Chrome use Install App. On iPhone use Share → Add to Home Screen.'],
    ['Why do some passages open externally?', 'The app uses KJV lookup and cached passages. External KJV links are provided when live lookup is unavailable.'],
    ['How do I save prayers across devices?', 'Sign in, configure Supabase, then use Cloud Sync in Profile to push and pull your data.'],
    ['Is the AI a replacement for pastoral counsel?', 'No. AI is only a study and drafting assistant. Scripture, prayer, church community, and wise counsel remain essential.'],
    ['Where are my notes stored?', 'Local notes are saved in this browser. Cloud sync saves selected records to your Supabase account.']
  ];
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Help & FAQ" sub="Quick answers for testing, launch, installation, sync, Bible reading, and AI tools." />
    <section className="grid md:grid-cols-2 gap-4">{faqs.map(([q, a]) => <article key={q} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="font-black text-lg">{q}</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">{a}</p></article>)}</section>
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft"><h3 className="font-black text-2xl">Launch checklist</h3><div className="grid md:grid-cols-3 gap-3 mt-4 text-sm"><p>✓ Test signup/signin</p><p>✓ Verify /journal and /reminders</p><p>✓ Test /devotions/1</p><p>✓ Test AI assistant</p><p>✓ Export/import backup</p><p>✓ Install as PWA on phone</p></div></section>
  </main></Shell>;
}


function readAppData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('s4es-'));
  const data = {};
  keys.forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(k)); }
    catch { data[k] = localStorage.getItem(k); }
  });
  return { app: 'Scriptures for Every Situation', version: '6.1.0', exportedAt: new Date().toISOString(), data };
}

function SettingsPage() {
  const [prefs, setPrefs] = useLocal('s4es-app-preferences', { translation: 'KJV', fontSize: 'Comfortable', compactCards: true, dailyStart: 'morning' });
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const keys = Object.keys(localStorage).filter(k => k.startsWith('s4es-'));
  function exportData() {
    const blob = new Blob([JSON.stringify(readAppData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scriptures-for-every-situation-backup-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Backup file downloaded. Keep it private because it may contain prayers, notes, and study records.');
  }
  function importData() {
    try {
      const parsed = JSON.parse(importText);
      const data = parsed.data || parsed;
      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('s4es-')) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      });
      setMessage('Import complete. Refreshing app...');
      setTimeout(() => location.reload(), 700);
    } catch (e) { setMessage('Import failed. Paste a valid backup JSON file.'); }
  }
  function clearLocal() {
    if (!confirm('Clear all local app data on this device? This will not delete cloud data in Supabase.')) return;
    keys.forEach(k => localStorage.removeItem(k));
    setMessage('Local data cleared. Refreshing app...');
    setTimeout(() => location.reload(), 700);
  }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Launch Center & Settings" sub="Manage backups, local data, reading preferences, privacy links, and production launch readiness." />
    <section className="grid md:grid-cols-4 gap-4"><DashboardCard to="/profile" icon={<User />} title="Member Account" sub="Sign in and use cloud sync" /><DashboardCard to="/onboarding" icon={<CheckCircle2 />} title="Onboarding" sub="Personalize interests and rhythm" /><DashboardCard to="/settings" icon={<Database />} title={`${keys.length} Local Stores`} sub="Device data namespaces" /><DashboardCard to="/privacy" icon={<ShieldCheck />} title="Privacy" sub="Review user-data handling" /><DashboardCard to="/contact" icon={<HeartHandshake />} title="Feedback" sub="Collect launch feedback" /></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black text-xl flex gap-2"><Download /> Backup & Restore</h3><p className="text-sm text-slate-600 dark:text-slate-300">Export or import Prayer Journal, Favorites, Study Notes, Reminders, Devotion Progress, and preferences stored on this device.</p><div className="flex flex-wrap gap-3"><button onClick={exportData} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Export Backup</button><button onClick={clearLocal} className="rounded-2xl bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200 px-5 py-3 font-black">Clear Local Data</button></div><textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste backup JSON here to restore on this device" className="w-full min-h-32 rounded-3xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-4 outline-none" /><button onClick={importData} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-black">Import Backup</button>{message && <p className="text-sm font-bold text-slate-500">{message}</p>}</section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4"><h3 className="font-black text-xl">Reading Preferences</h3><div className="grid md:grid-cols-4 gap-3"><label><span className="text-xs font-bold text-slate-500">Translation</span><select value={prefs.translation} onChange={e => setPrefs({ ...prefs, translation: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">{PUBLIC_TRANSLATIONS.map(t => <option key={t.code} value={t.code}>{t.label} — {t.name}</option>)}<option disabled>──────── Licensed translations require permission ────────</option>{LICENSED_TRANSLATIONS.map(t => <option key={t} disabled>{t} — license required</option>)}</select></label><label><span className="text-xs font-bold text-slate-500">Font Size</span><select value={prefs.fontSize} onChange={e => setPrefs({ ...prefs, fontSize: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option>Compact</option><option>Comfortable</option><option>Large</option></select></label><label><span className="text-xs font-bold text-slate-500">Daily Start</span><select value={prefs.dailyStart} onChange={e => setPrefs({ ...prefs, dailyStart: e.target.value })} className="mt-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700"><option>morning</option><option>noon</option><option>evening</option></select></label><label className="flex items-end gap-2"><input type="checkbox" checked={prefs.compactCards} onChange={e => setPrefs({ ...prefs, compactCards: e.target.checked })} /> <span className="font-bold text-sm">Compact cards</span></label></div></section>
    <section className="grid md:grid-cols-4 gap-4"><Link to="/about" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm font-black">About the App</Link><Link to="/privacy" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm font-black">Privacy Policy</Link><Link to="/terms" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm font-black">Terms of Use</Link><Link to="/contact" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm font-black">Contact & Feedback</Link><Link to="/help" className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm font-black">Help & FAQ</Link></section>
  </main></Shell>;
}


function AnalyticsPage() {
  const [completed] = useLocal('s4es-completed-devotions', []);
  const [journal] = useLocal('s4es-prayer-journal', []);
  const [favorites] = useLocal('s4es-favorites', []);
  const [reminders] = useLocal('s4es-reminders', { morning: '07:00', noon: '12:00', night: '21:00', focus: 'Daily Morning Devotion', enabled: false });
  const [feedback] = useLocal('s4es-feedback', []);
  const [studies] = useLocal('s4es-study-notes', []);
  const [sermons] = useLocal('s4es-sermons', []);
  const [searchHistory] = useLocal('s4es-search-history', []);
  const [recentChapters] = useLocal('s4es-recent-chapters', []);
  const [prefs] = useLocal('s4es-onboarding', { topics: [], goal: 'Daily growth', time: 'Morning' });
  const streak = calcStreak(completed);
  const answered = journal.filter(e => e.status === 'Answered' || e.answered).length;
  const waiting = journal.filter(e => (e.status || (e.answered ? 'Answered' : 'Waiting')) === 'Waiting').length;
  const ongoing = journal.filter(e => (e.status || '').toLowerCase() === 'ongoing').length;
  const completionPct = Math.round((completed.length / 365) * 100);
  const topTopicNames = (prefs.topics || []).slice(0, 6);
  const last7 = completed.filter(d => d >= Math.max(1, dayOfYear() - 6)).length;
  const cards = [
    ['Completed Devotions', completed.length, `${completionPct}% of the 365-day devotional journey`, ListChecks, '/progress'],
    ['Current Streak', streak.current, `Longest streak: ${streak.longest}`, Flame, '/progress'],
    ['Prayer Entries', journal.length, `${answered} answered • ${ongoing} ongoing • ${waiting} waiting`, PenLine, '/journal'],
    ['Favorites', favorites.length, 'Saved verses, devotions, and study items', Star, '/favorites'],
    ['Study Notes', studies.length, 'Observation, interpretation, application, and prayer notes', BrainCircuit, '/study'],
    ['Saved Sermons', sermons.length, 'Prepared sermon outlines and teaching drafts', BookOpen, '/sermons'],
    ['Feedback Items', feedback.length, 'Local feedback inbox for launch testing', MessageSquare, '/contact'],
    ['Recent Searches', searchHistory.length, 'Tracked locally to improve discovery', History, '#search-history'],
  ];
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="Usage Analytics" sub="V6.2 launch analytics: track devotional progress, prayer activity, favorites, searches, recent Bible chapters, feedback, and feature usage from this device." />
    <section className="grid md:grid-cols-4 gap-4">{cards.map(([title, value, sub, Icon, to]) => <Link key={title} to={to} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm hover:shadow-soft"><Icon size={30} className="text-slate-500" /><h3 className="font-black text-3xl mt-2">{value}</h3><p className="font-black mt-1">{title}</p><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{sub}</p></Link>)}</section>
    <section className="grid md:grid-cols-3 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl flex gap-2"><TrendingUp />Weekly Devotion Activity</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{last7} completed in the last seven devotion days.</p><div className="mt-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-slate-950 dark:bg-white" style={{ width: `${Math.min(100, Math.round((last7 / 7) * 100))}%` }} /></div></div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl flex gap-2"><Bell />Reminder Status</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{reminders.enabled ? 'Browser reminders are enabled.' : 'Reminders are not enabled yet.'}</p><p className="text-xs font-bold text-slate-500 mt-3">Morning {reminders.morning || '07:00'} • Noon {reminders.noon || '12:00'} • Night {reminders.night || '21:00'}</p></div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl flex gap-2"><Activity />Personalization</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Goal: {prefs.goal || 'Daily growth'} • Time: {prefs.time || 'Morning'}</p><p className="text-xs font-bold text-slate-500 mt-3">{topTopicNames.length ? topTopicNames.join(' • ') : 'No topics selected yet.'}</p></div></section>
    <section id="search-history" className="grid md:grid-cols-2 gap-4"><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl mb-4 flex gap-2"><History />Search History</h3>{searchHistory.length ? <div className="space-y-2">{searchHistory.slice(0, 12).map(x => <Link key={x.q + x.at} to={`/?q=${encodeURIComponent(x.q)}`} className="block rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><span className="font-bold">{x.q}</span><span className="block text-xs text-slate-500">{new Date(x.at).toLocaleString()}</span></Link>)}</div> : <p className="text-sm text-slate-500">Search from the home page to populate this list.</p>}</div><div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl mb-4 flex gap-2"><Library />Recently Opened Bible Chapters</h3>{recentChapters.length ? <div className="space-y-2">{recentChapters.slice(0, 12).map(x => <Link key={x.path} to={x.path} className="block rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><span className="font-bold">{x.book} {x.chapter}</span><span className="block text-xs text-slate-500">{new Date(x.at).toLocaleString()}</span></Link>)}</div> : <p className="text-sm text-slate-500">Open Bible chapters to build your recent reading list.</p>}</div></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl mb-4">Admin-Ready Launch Signals</h3><div className="grid md:grid-cols-4 gap-3 text-sm"><Link to="/contact" className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><b>Feedback inbox:</b><br />{feedback.length} saved items</Link><Link to="/favorites" className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><b>Saved content:</b><br />{favorites.length} favorites</Link><Link to="/journal" className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><b>Prayer engagement:</b><br />{journal.length} entries</Link><Link to="/settings" className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><b>Backup/export:</b><br />Ready in Launch Center</Link></div></section>
  </main></Shell>;
}


function ContentQualityPage() {
  const curatedVerses = verses.filter(v => v.curated).length;
  const referenceOnly = verses.length - curatedVerses;
  const devotionStoryReady = devotions.filter(d => d.bibleStory && d.lifeStory && d.message && d.interpretation && d.actionStep).length;
  const topicPrayerReady = topics.filter(t => (t.prayers || []).length >= 3 && (t.declarations || []).length >= 3).length;
  const topicRows = topics.map(t => {
    const curated = (t.verses || []).filter(v => v.curated).length;
    return { title: t.title, group: t.group, total: (t.verses || []).length, curated, referenceOnly: (t.verses || []).length - curated };
  });
  const checks = [
    ['365 daily devotions contain Bible story, life story, interpretation, prayer, declaration, reflection, and action step', devotionStoryReady, devotions.length],
    ['24 topics include prayer points and declarations', topicPrayerReady, topics.length],
    ['Full topical scripture library is indexed and searchable', verses.length, 2400],
    ['Curated full-verse cards are available now; remaining references open through KJV lookup/API', curatedVerses, verses.length],
  ];
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="Content Quality Finalization" sub="V6.8 audit center for devotion quality, scripture curation, prayer/declaration polish, and launch content readiness." />
    <section className="grid md:grid-cols-4 gap-4">
      <DashboardCard to="/devotions" icon={<Sunrise size={30} />} title={`${devotionStoryReady}/365 Devotions`} sub="Story, message, prayer, reflection, action step" />
      <DashboardCard to="/topics" icon={<Database size={30} />} title={`${verses.length} References`} sub={`${curatedVerses} full-text curated • ${referenceOnly} KJV lookup/reference cards`} />
      <DashboardCard to="/topics" icon={<ShieldCheck size={30} />} title={`${topicPrayerReady}/24 Topics`} sub="Prayer and declaration sections ready" />
      <DashboardCard to="/assistant" icon={<Sparkles size={30} />} title="AI Review Ready" sub="Use AI tools to expand, refine, or contextualize content" />
    </section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-4">
      <h3 className="font-black text-2xl">Launch Content Checklist</h3>
      <div className="grid md:grid-cols-2 gap-3">{checks.map(([label, value, total]) => <div key={label} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><p className="font-black">{label}</p><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{value} / {total} complete</p><div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div className="h-full bg-slate-950 dark:bg-white" style={{ width: `${Math.min(100, Math.round((value / total) * 100))}%` }} /></div></div>)}</div>
    </section>
    <section className="grid md:grid-cols-3 gap-4">
      <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl">Devotional Standard</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">Every daily devotion should include the Bible reference, a Bible story or background, a life application story, message interpretation, Scripture application, morning prayer, declaration, reflection question, and action step.</p></article>
      <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl">Scripture Standard</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">Full KJV text should be used where curated. Reference-only cards now function as study prompts with Open KJV and live passage lookup, so users can still read the passage while the library is progressively curated.</p></article>
      <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-xl">Pastoral Standard</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">Messages should remain biblical, practical, non-manipulative, and pastoral. AI outputs should encourage prayer, Scripture, wise counsel, and responsible action.</p></article>
    </section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-2xl mb-4">Topic Curation Snapshot</h3><div className="grid md:grid-cols-2 gap-3">{topicRows.map(row => <Link to={`/topic/${topics.find(t => t.title === row.title)?.id}`} key={row.title} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="flex items-center justify-between"><b>{row.title}</b><span className="text-xs font-bold text-slate-500">{row.group}</span></div><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{row.curated} full-text curated • {row.referenceOnly} reference/lookup cards • {row.total} total</p></Link>)}</div></section>
  </main></Shell>;
}


function UIPolishPage() {
  const polishItems = [
    ['Compact navigation', 'Read, Grow, and AI Tools menus are grouped so the header stays clean on desktop and mobile.'],
    ['Mobile-first spacing', 'Core cards use consistent rounded panels, readable text sizes, and tighter sections for small screens.'],
    ['Clear empty states', 'Journal, favorites, study notes, sermons, and sync areas now guide users when no content exists yet.'],
    ['Consistent action buttons', 'Share, copy, audio, save, and sync actions are visually consistent across the app.'],
    ['Launch readability', 'Devotions, Bible chapters, topics, and AI responses use generous line height and high-contrast text.'],
    ['Final route checks', 'Primary routes are visible through compact tabs, bottom navigation, and the More panel.']
  ];
  const routeChecks = [
    ['Home', '/'], ['Topics', '/topics'], ['Bible', '/bible'], ['Devotions', '/devotions'], ['Habits', '/habits'], ['Progress', '/progress'], ['Journal', '/journal'], ['Favorites', '/favorites'], ['Reminders', '/reminders'], ['Study', '/study'], ['Companion', '/companion'], ['Sermons', '/sermons'], ['Assistant', '/assistant'], ['Profile', '/profile']
  ];
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="UI/UX Final Polish" sub="V6.9 launch polish center for navigation, spacing, empty states, mobile experience, and final route checks." />
    <section className="grid md:grid-cols-3 gap-4">
      <DashboardCard to="/" icon={<Home size={30} />} title="Cleaner Home" sub="Dashboard cards are grouped by daily growth, prayer life, AI tools, and launch utilities." />
      <DashboardCard to="/settings" icon={<ShieldCheck size={30} />} title="Launch Ready" sub="Settings, backup, privacy, terms, contact, and support remain available from one center." />
      <DashboardCard to="/profile" icon={<Database size={30} />} title="Synced Profile" sub="Auth, Supabase readiness, and cloud sync are surfaced from Profile." />
    </section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-2xl mb-4">Polish Checklist</h3><div className="grid md:grid-cols-2 gap-3">{polishItems.map(([title, text]) => <div key={title} className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700"><div className="flex items-start gap-3"><CheckCircle2 className="text-emerald-600 shrink-0" /><div><h4 className="font-black">{title}</h4><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{text}</p></div></div></div>)}</div></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-2xl mb-4">Route Quick Check</h3><div className="grid grid-cols-2 md:grid-cols-7 gap-2">{routeChecks.map(([label, to]) => <Link key={to} to={to} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-3 text-sm font-black text-center hover:bg-slate-200 dark:hover:bg-slate-700">{label}</Link>)}</div></section>
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft"><h3 className="font-black text-2xl">V7.3 special collections launch note</h3><p className="mt-2 text-slate-300 text-sm leading-7">This final launch build focuses on public readiness: complete route access, privacy and terms, feedback, cloud sync, AI tools, Bible/devotion workflows, mobile clarity, and stable deployment.</p></section>
  </main></Shell>;
}


function LaunchPage() {
  const checklist = [
    ['Core Bible app', 'Genesis to Revelation reader, chapter navigation, saved chapters, notes, highlights, copy/share/audio tools.'],
    ['Devotions', '365 morning devotions with Bible background, life story, interpretation, prayer, declaration, reflection, and action step.'],
    ['Prayer ecosystem', 'Prayer journal, answered-prayer testimony tracking, favorites, reminders, habits, streaks, and weekly growth summary.'],
    ['AI ministry tools', 'Scripture guidance, Bible study companion, sermon builder, prayer guide, devotional/life application, and saved AI notes.'],
    ['Cloud readiness', 'Supabase authentication, profile, cloud sync center, backup/export/import, and device restore workflow.'],
    ['Launch pages', 'About, Privacy, Terms, Contact, Help/FAQ, Settings, UI polish, content quality, analytics, and feedback capture.'],
    ['Mobile/PWA', 'Installable browser app, manifest, service worker, mobile bottom nav, compact More menu, and responsive dashboard cards.'],
    ['Safety and trust', 'KJV/public-domain oriented references, clear AI limitations, privacy language, and user-controlled data clearing/export.']
  ];
  const routeChecks = ['/', '/topics', '/bible', '/devotions', '/habits', '/progress', '/journal', '/favorites', '/reminders', '/study', '/companion', '/sermons', '/assistant', '/profile', '/settings', '/about', '/privacy', '/terms', '/contact', '/help', '/quality', '/polish'];
  return <Shell><main className="p-4 md:p-8 space-y-8"><PageTitle title="V7.3 Special Collections" sub="Final public-launch control center for Scriptures for Every Situation." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 md:p-8 shadow-soft"><div className="flex items-start gap-4"><Trophy className="text-yellow-300 shrink-0" size={42} /><div><h3 className="font-black text-3xl">Launch-ready Christian platform</h3><p className="mt-2 text-slate-300 text-sm leading-7">This version consolidates Bible reading, topical scriptures, daily devotion, prayer journal, study workspace, sermon builder, AI guidance, habits, cloud sync, privacy, terms, feedback, analytics, and final UI polish into one public launch build.</p></div></div></section>
    <section className="grid md:grid-cols-4 gap-4"><DashboardCard to="/bible" icon={<Library size={30} />} title="66 Bible Books" sub="Genesis to Revelation reading experience" /><DashboardCard to="/devotions" icon={<Sunrise size={30} />} title="365 Devotions" sub="Daily stories, prayers, and action steps" /><DashboardCard to="/assistant" icon={<Sparkles size={30} />} title="Real AI Guidance" sub="OpenAI-powered scripture-centered help" /><DashboardCard to="/profile" icon={<Database size={30} />} title="Cloud Sync" sub="Supabase auth and user data readiness" /></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-2xl mb-4">Final Launch Checklist</h3><div className="grid md:grid-cols-2 gap-3">{checklist.map(([title, text]) => <div key={title} className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700"><div className="flex items-start gap-3"><CheckCircle2 className="text-emerald-600 shrink-0" /><div><h4 className="font-black">{title}</h4><p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-6">{text}</p></div></div></div>)}</div></section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft"><h3 className="font-black text-2xl mb-4">Quick Route Test</h3><div className="grid grid-cols-2 md:grid-cols-6 gap-2">{routeChecks.map(r => <Link key={r} to={r} className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 text-sm font-black text-center">{r === '/' ? 'Home' : r}</Link>)}</div></section>
    <section className="grid md:grid-cols-4 gap-4"><DashboardCard to="/privacy" icon={<ShieldCheck size={30} />} title="Privacy" sub="User data and AI-processing notice" /><DashboardCard to="/terms" icon={<ShieldCheck size={30} />} title="Terms" sub="Devotional and educational use statement" /><DashboardCard to="/contact" icon={<HeartHandshake size={30} />} title="Feedback" sub="Bug reports, ideas, and launch feedback" /><DashboardCard to="/settings" icon={<Download size={30} />} title="Backup" sub="Export/import and clear local data" /></section>
  </main></Shell>;
}

function AboutPage() {
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="About Scriptures for Every Situation" sub="A Christian Bible, devotion, prayer, study, and AI-guidance platform." /><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200"><p><b>Mission:</b> help believers find Scripture, pray with understanding, study the Bible, track spiritual growth, and apply God's Word to real life.</p><p>The app currently focuses on KJV references and practical Christian encouragement. Future versions can add licensed translations, church groups, cloud-first sync, push notifications, and pastor/teacher tools.</p><p>Use the AI tools as study assistance, not as a replacement for Scripture, prayer, pastoral counsel, or mature Christian discernment.</p></section></main></Shell>;
}
function PrivacyPage() {
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Privacy Policy" sub="Plain-language privacy summary for launch testing." /><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200"><p>Local app data such as prayer entries, favorites, reminders, study notes, completed devotions, and preferences may be stored in your browser localStorage.</p><p>If you sign in and use Cloud Sync, selected data may be saved to your Supabase account so it can be restored across devices.</p><p>Do not store highly sensitive personal information unless you are comfortable saving it. You can export or clear local data in Launch Center.</p><p>AI requests may be sent to the configured AI provider to generate scripture-centered guidance. Avoid sending private information that you do not want processed by an external service.</p></section></main></Shell>;
}
function TermsPage() {
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Terms of Use" sub="Basic terms for early release and testing." /><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200"><p>This app provides Bible references, devotionals, prayer tools, study notes, and AI-assisted Christian content for educational and devotional use.</p><p>It is not a substitute for pastoral counseling, professional mental-health support, medical advice, legal advice, or financial advice.</p><p>Bible translation rights must be respected. The current build uses KJV-oriented references and lookup links; additional translations should be licensed before commercial use.</p></section></main></Shell>;
}
function ContactPage() {
  const [items, setItems] = useLocal('s4es-feedback', []);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  function submit() { if (!form.message.trim()) return; setItems([{ id: Date.now(), ...form, createdAt: new Date().toISOString() }, ...items]); setForm({ name: '', email: '', message: '' }); }
  return <Shell><main className="p-4 md:p-8 space-y-6"><PageTitle title="Contact & Feedback" sub="Collect feedback locally during testing. Later this can be connected to Supabase or email." /><section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-soft space-y-3"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Feedback, bug report, feature idea, or testimony" className="w-full min-h-36 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700" /><button onClick={submit} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-5 py-3 font-black">Save Feedback</button></section><section className="grid md:grid-cols-2 gap-4">{items.slice(0, 10).map(x => <article key={x.id} className="rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-bold text-slate-500">{new Date(x.createdAt).toLocaleString()}</p><h3 className="font-black mt-1">{x.name || 'Anonymous'}</h3><p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap mt-2">{x.message}</p></article>)}</section></main></Shell>;
}


function SeasonalDevotionsPage() {
  const [selected, setSelected] = useLocal('s4es-seasonal-selected', 'christmas');
  const [completed, setCompleted] = useLocal('s4es-seasonal-completed', []);
  const [query, setQuery] = useState('');
  const current = seasonalCollections.find(c => c.id === selected) || seasonalCollections[0];
  const allItems = seasonalCollections.flatMap(c => c.items.map(item => ({ ...item, collection: c.title, collectionId: c.id, season: c.season })));
  const results = query.trim() ? allItems.filter(item => `${item.title} ${item.reference} ${item.message} ${item.collection} ${item.season}`.toLowerCase().includes(query.toLowerCase())) : [];
  const total = seasonalCollections.reduce((n, c) => n + c.items.length, 0);
  const toggle = (id, title) => {
    const key = `${id}:${title}`;
    setCompleted(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };
  const completedForCurrent = current.items.filter(d => completed.includes(`${current.id}:${d.title}`)).length;
  return <Shell><main className="p-4 md:p-8 space-y-8">
    <PageTitle title="V9.0 Seasonal Devotions" sub="Original devotion tracks for Christmas, Easter, New Year, Thanksgiving, Advent, and Lent with Bible context, life application, prayer, and reflection." />
    <section className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-soft">
      <h3 className="font-black text-2xl">Seasonal dashboard</h3>
      <p className="text-slate-300 text-sm mt-2 max-w-3xl">Use seasonal devotion tracks for church calendars, personal reflection, family worship, and special times of spiritual focus.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{seasonalCollections.length}</p><p className="text-xs text-slate-300">Seasons</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{total}</p><p className="text-xs text-slate-300">Starter devotions</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{completed.length}</p><p className="text-xs text-slate-300">Completed</p></div>
        <div className="rounded-3xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-black">{Math.round((completed.length / Math.max(total, 1)) * 100)}%</p><p className="text-xs text-slate-300">Overall progress</p></div>
      </div>
    </section>
    <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm flex gap-2 items-center"><Search className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search seasonal devotions e.g. cross, birth, gratitude, fasting, hope" className="w-full bg-transparent outline-none" /></section>
    {query && <section className="space-y-4"><h3 className="font-black text-xl">Seasonal Search Results</h3><div className="grid md:grid-cols-2 gap-4">{results.slice(0, 12).map(d => <article key={`${d.collectionId}-${d.title}`} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><p className="text-xs font-black text-slate-500">{d.collection} • {d.reference}</p><h4 className="font-black text-lg mt-1">{d.title}</h4><p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mt-2">{d.message}</p><div className="flex gap-2 mt-3"><button onClick={() => speak(`${d.title}. ${d.reference}. ${d.message}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-black">Audio</button><button onClick={() => copyText(`${d.title}\n${d.reference}\n\n${d.message}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-black">Copy</button></div></article>)}</div></section>}
    <section className="grid md:grid-cols-3 gap-4">
      {seasonalCollections.map(c => <button key={c.id} onClick={() => setSelected(c.id)} className={cls('text-left rounded-[2rem] border p-5 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800', selected === c.id ? 'ring-4 ring-slate-950/10 dark:ring-white/20' : '')}>
        <div className="text-4xl">{c.icon}</div><h3 className="font-black text-xl mt-3">{c.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{c.description}</p><p className="text-xs font-black mt-3 text-slate-500">{c.items.length} starter devotions</p>
      </button>)}
    </section>
    <section className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-3"><div className="text-4xl">{current.icon}</div><div><h3 className="text-2xl font-black">{current.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{current.description}</p><p className="text-xs font-bold text-slate-500 mt-1">Progress: {completedForCurrent}/{current.items.length}</p></div></div>
        {current.items.map((d, i) => {
          const key = `${current.id}:${d.title}`;
          const done = completed.includes(key);
          return <article key={d.title} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-500">SEASONAL DEVOTION {i + 1} • {d.reference}</p><h4 className="font-black text-xl">{d.title}</h4></div><button onClick={() => toggle(current.id, d.title)} className={cls('rounded-2xl px-3 py-2 text-xs font-black', done ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800')}>{done ? 'Completed' : 'Mark Complete'}</button></div>
            <InfoBlock title="Bible story / background" text={d.story} />
            <InfoBlock title="Seasonal message" text={d.message} />
            <InfoBlock title="Prayer" text={d.prayer} />
            <p className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-4 text-sm font-bold">Declaration: {current.declaration}</p>
            <div className="flex flex-wrap gap-2"><button onClick={() => speak(`${d.title}. ${d.reference}. ${d.message}. Prayer: ${d.prayer}`)} className="rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-xs font-black">Listen</button><button onClick={() => copyText(`${d.title}\n${d.reference}\n\n${d.message}\n\nPrayer: ${d.prayer}`)} className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-black">Copy</button></div>
          </article>;
        })}
      </div>
      <aside className="space-y-4">
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">How to use seasonal devotions</h4><ul className="mt-3 text-sm space-y-2 text-slate-600 dark:text-slate-300"><li>• Read one devotion during the relevant season.</li><li>• Use the Bible story as context for family or group discussion.</li><li>• Pray the written prayer aloud.</li><li>• Mark progress and revisit favorites yearly.</li></ul></div>
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h4 className="font-black text-xl">Seasonal focus</h4><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Christmas points to Christ’s coming, Easter to His victory, New Year to consecration, Thanksgiving to gratitude, Advent to hope, and Lent to repentance and surrender.</p></div>
      </aside>
    </section>
  </main></Shell>;
}

function PageTitle({ title, sub }) { return <div><h2 className="text-3xl md:text-4xl font-black">{title}</h2><p className="text-slate-600 dark:text-slate-300 mt-2">{sub}</p></div>; }
function NotFound() { return <Shell><main className="p-8"><PageTitle title="Page not found" sub="Return home to continue." /><Link to="/" className="mt-5 inline-block rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2 font-bold">Home</Link></main></Shell>; }

















function FinalStoreReleasePage() {
  const [checks, setChecks] = useLocal('s4es-v90-final-checks', []);
  const done = checks.length;
  const total = launchChecklist.checklist.length;
  const percent = Math.round((done / total) * 100);

  const toggle = (item) => {
    setChecks(checks.includes(item) ? checks.filter(x => x !== item) : [...checks, item]);
  };

  const copyStoreListing = async () => {
    const text = `${launchChecklist.storeText.title}

Short Description:
${launchChecklist.storeText.shortDescription}

Full Description:
${launchChecklist.storeText.fullDescription}`;
    await navigator.clipboard?.writeText(text);
  };

  const downloadLaunchPack = () => {
    const text = `V9.0 Final Store Release Checklist

Progress: ${done}/${total} (${percent}%)

${launchChecklist.checklist.map((x, i) => `${checks.includes(x) ? '[x]' : '[ ]'} ${i + 1}. ${x}`).join('\n')}

Store Title:
${launchChecklist.storeText.title}

Short Description:
${launchChecklist.storeText.shortDescription}

Full Description:
${launchChecklist.storeText.fullDescription}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'v9-final-store-release-pack.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Final Store Release Build" sub="V9.0 • Production launch, store readiness, final QA, PWA, Android, iOS, deployment, and release checklist." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/store-release" icon={<Rocket />} value="V9.0" label="Final release" />
          <Stat to="/store-release" icon={<BadgeCheck />} value={`${done}/${total}`} label="Checklist" />
          <Stat to="/store-release" icon={<ShieldCheck />} value={`${percent}%`} label="Ready" />
          <Stat to="/store-release" icon={<Smartphone />} value="PWA" label="Mobile ready" />
        </section>

        <section className="grid lg:grid-cols-[1fr_380px] gap-5">
          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Final QA Checklist</h3>
            {launchChecklist.checklist.map(item => (
              <button key={item} onClick={() => toggle(item)} className={`w-full text-left rounded-2xl border dark:border-slate-800 p-4 ${checks.includes(item) ? 'bg-green-50 dark:bg-green-950/30' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="font-bold">{checks.includes(item) ? '✓ ' : ''}{item}</div>
              </button>
            ))}
          </section>

          <aside className="space-y-5">
            <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-black text-xl">Store Listing</h3>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <div className="text-xs font-black text-slate-500">Title</div>
                <div className="font-black">{launchChecklist.storeText.title}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <div className="text-xs font-black text-slate-500">Short Description</div>
                <div className="text-sm">{launchChecklist.storeText.shortDescription}</div>
              </div>
              <button onClick={copyStoreListing} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Copy Store Text</button>
            </section>

            <section className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-black text-xl">Release Pack</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Download final QA and store listing checklist.</p>
              <button onClick={downloadLaunchPack} className="rounded-full px-4 py-2 bg-white dark:bg-slate-800 text-sm font-black">Download Launch Pack</button>
            </section>

            <section className="rounded-[2rem] bg-green-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-black text-xl">Build Targets</h3>
              <div className="grid gap-2 text-sm">
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 font-bold">PWA / Vercel</div>
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 font-bold">Android APK / AAB via Capacitor</div>
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 font-bold">iOS wrapper via Capacitor</div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </Shell>
  );
}


function ChurchMinistrySuitePage() {
  const [tab, setTab] = React.useState('Dashboard');
  const [attendance, setAttendance] = useLocal('s4es-v89-attendance', []);
  const [groups, setGroups] = useLocal('s4es-v89-groups', churchSuite.sampleGroups);
  const [prayers, setPrayers] = useLocal('s4es-v89-prayers', []);
  const [events, setEvents] = useLocal('s4es-v89-events', []);
  const [announcements, setAnnouncements] = useLocal('s4es-v89-announcements', []);
  const [volunteers, setVolunteers] = useLocal('s4es-v89-volunteers', []);
  const [form, setForm] = React.useState({ name:'', group:'', note:'', title:'', date:'', message:'', role:'' });

  const clear = () => setForm({ name:'', group:'', note:'', title:'', date:'', message:'', role:'' });
  const addAttendance = () => { if(!form.name.trim()) return; setAttendance([{id:Date.now(),name:form.name,group:form.group||'General',status:'Present',note:form.note,date:new Date().toLocaleDateString()},...attendance]); clear(); };
  const addGroup = () => { if(!form.title.trim()) return; setGroups([{name:form.title,leader:form.name||'Leader',day:form.date||'Weekly',focus:form.note||'Bible study'},...groups]); clear(); };
  const addPrayer = () => { if(!form.message.trim()) return; setPrayers([{id:Date.now(),request:form.message,category:form.group||'General',status:'Praying',testimony:'',date:new Date().toLocaleDateString()},...prayers]); clear(); };
  const addEvent = () => { if(!form.title.trim()) return; setEvents([{id:Date.now(),title:form.title,date:form.date,location:form.group,team:form.name,note:form.note},...events]); clear(); };
  const addAnnouncement = () => { if(!form.title.trim()) return; setAnnouncements([{id:Date.now(),title:form.title,message:form.message,audience:form.group||'All',priority:form.role||'Normal'},...announcements]); clear(); };
  const addVolunteer = () => { if(!form.name.trim()) return; setVolunteers([{id:Date.now(),name:form.name,role:form.role||'Worker',availability:form.date||'Flexible',assignment:form.group||'General Ministry'},...volunteers]); clear(); };
  const markAnswered = id => setPrayers(prayers.map(p => p.id===id ? {...p,status:p.status==='Answered'?'Praying':'Answered'} : p));
  const exportSummary = async () => await navigator.clipboard?.writeText(`Church & Ministry Suite Summary\nAttendance: ${attendance.length}\nGroups: ${groups.length}\nPrayer Requests: ${prayers.length}\nEvents: ${events.length}\nAnnouncements: ${announcements.length}\nVolunteers: ${volunteers.length}`);

  return (
    <Shell><main className="p-4 md:p-8 space-y-6">
      <PageTitle title="Church & Ministry Suite" sub="V9.0 • Attendance, cell groups, prayer requests, events, announcements, volunteers, and ministry dashboard." />
      <section className="grid md:grid-cols-4 gap-4">
        <Stat to="/ministry" icon={<UserCheck />} value={attendance.length} label="Attendance" />
        <Stat to="/ministry" icon={<UsersRound />} value={groups.length} label="Groups" />
        <Stat to="/ministry" icon={<HandHeart />} value={prayers.length} label="Prayer requests" />
        <Stat to="/ministry" icon={<CalendarCheck />} value={events.length} label="Events" />
      </section>
      <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex flex-wrap gap-2">{['Dashboard','Attendance','Groups','Prayer','Events','Announcements','Volunteers'].map(t=><button key={t} onClick={()=>setTab(t)} className={`rounded-full px-4 py-2 text-sm font-black ${tab===t?'bg-slate-950 text-white dark:bg-white dark:text-slate-950':'bg-slate-100 dark:bg-slate-800'}`}>{t}</button>)}</div></section>
      {tab==='Dashboard'&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{churchSuite.modules.map(m=><article key={m.id} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><h3 className="text-2xl font-black">{m.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{m.description}</p><div className="flex flex-wrap gap-2 mt-4">{m.fields.map(f=><span key={f} className="rounded-full px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold">{f}</span>)}</div></article>)}<button onClick={exportSummary} className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 text-left shadow-sm"><ClipboardCheck size={34}/><h3 className="text-2xl font-black mt-3">Copy Ministry Summary</h3></button></section>}
      {tab==='Attendance'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Attendance" form={form} setForm={setForm} onSave={addAttendance} fields={['name','group','note']} /><ListBox items={attendance.map(a=>({title:a.name,body:`${a.group} • ${a.date}`,note:a.note}))}/></section>}
      {tab==='Groups'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Group" form={form} setForm={setForm} onSave={addGroup} fields={['title','name','date','note']} /><ListBox items={groups.map(g=>({title:g.name,body:`Leader: ${g.leader}`,note:`${g.day} • ${g.focus}`}))}/></section>}
      {tab==='Prayer'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Prayer Request" form={form} setForm={setForm} onSave={addPrayer} fields={['message','group']} textarea="message" /><div className="grid md:grid-cols-2 gap-3">{prayers.map(p=><div key={p.id} className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4"><b>{p.category}</b><p className="text-sm">{p.request}</p><button onClick={()=>markAnswered(p.id)} className="mt-3 rounded-full px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold">{p.status}</button></div>)}</div></section>}
      {tab==='Events'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Event" form={form} setForm={setForm} onSave={addEvent} fields={['title','date','group','name','note']} /><ListBox items={events.map(e=>({title:e.title,body:`${e.date} • ${e.location}`,note:`Team: ${e.team}`}))}/></section>}
      {tab==='Announcements'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Announcement" form={form} setForm={setForm} onSave={addAnnouncement} fields={['title','message','group','role']} textarea="message" /><ListBox items={announcements.map(a=>({title:a.title,body:a.message,note:a.audience}))}/></section>}
      {tab==='Volunteers'&&<section className="grid lg:grid-cols-[380px_1fr] gap-5"><FormBox title="Add Volunteer" form={form} setForm={setForm} onSave={addVolunteer} fields={['name','role','date','group']} /><ListBox items={volunteers.map(v=>({title:v.name,body:v.role,note:`${v.availability} • ${v.assignment}`}))}/></section>}
    </main></Shell>
  );
}
function FormBox({ title, form, setForm, onSave, fields, textarea }) {
  const labels = {name:'Name / Leader / Team', group:'Group / Location / Audience', note:'Note / Focus', title:'Title', date:'Date / Day / Availability', message:'Message', role:'Role / Priority'};
  return <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="font-black text-2xl">{title}</h3>{fields.map(f=> textarea===f ? <textarea key={f} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={labels[f]} className="w-full min-h-28 rounded-2xl border dark:border-slate-700 bg-transparent p-4"/> : <input key={f} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={labels[f]} className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3"/>)}<button onClick={onSave} className="rounded-full px-5 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">Save</button></div>;
}
function ListBox({ items }) {
  return <div className="grid md:grid-cols-2 gap-3">{items.map((x,i)=><div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4"><b>{x.title}</b><p className="text-sm">{x.body}</p><p className="text-sm text-slate-500">{x.note}</p></div>)}</div>;
}


function AIStudyProPage() {
  const [toolId, setToolId] = React.useState(aiStudyPro.tools[0]?.id || 'verse-explainer');
  const [input, setInput] = React.useState('');
  const [audience, setAudience] = React.useState('General');
  const [saved, setSaved] = useLocal('s4es-v88-ai-pro-saved', []);
  const [history, setHistory] = useLocal('s4es-v88-ai-pro-history', []);
  const activeTool = aiStudyPro.tools.find(t => t.id === toolId) || aiStudyPro.tools[0];

  const generateLocalDraft = () => {
    const topic = input.trim() || 'Faith and obedience';
    const draft = {
      id: Date.now(),
      tool: activeTool.title,
      topic,
      audience,
      createdAt: new Date().toISOString(),
      content: `${activeTool.title}\n\nTopic: ${topic}\nAudience: ${audience}\n\n1. Biblical Context\nThis study should begin by reading the passage carefully, identifying the speaker, audience, historical setting, and the main spiritual burden of the text.\n\n2. Main Meaning\nThe central truth is that God reveals Himself through Scripture and calls His people to respond with faith, repentance, obedience, and love.\n\n3. Key Scriptures\n- 2 Timothy 3:16-17\n- Psalm 119:105\n- James 1:22\n- Romans 15:4\n\n4. Practical Application\nAsk: What does this reveal about God? What does this expose in me? What obedience step should I take today?\n\n5. Reflection Questions\n- What truth should I believe?\n- What sin should I confess?\n- What promise should I hold?\n- What step should I take?\n\n6. Prayer\nLord, open my understanding, shape my heart, and help me obey Your Word with humility and courage. Amen.`
    };
    setHistory([draft, ...history].slice(0, 50));
  };

  const copyDraft = async (item) => {
    await navigator.clipboard?.writeText(item.content);
  };

  const saveDraft = (item) => {
    if (!saved.find(s => s.id === item.id)) setSaved([item, ...saved]);
  };

  const latest = history[0];

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="AI Bible Study Assistant Pro" sub="V9.0 • Verse explanations, chapter summaries, character studies, topic studies, sermons, lessons, small-group guides, and devotions." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/ai-pro" icon={<Bot />} value={aiStudyPro.tools.length} label="AI study tools" />
          <Stat to="/ai-pro" icon={<FileText />} value={history.length} label="Drafts generated" />
          <Stat to="/ai-pro" icon={<ClipboardList />} value={saved.length} label="Saved studies" />
          <Stat to="/ai-pro" icon={<Sparkles />} value="Pro" label="Study mode" />
        </section>

        <section className="grid lg:grid-cols-[340px_1fr] gap-5">
          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h3 className="font-black text-xl">Study Tools</h3>
            {aiStudyPro.tools.map(t => (
              <button key={t.id} onClick={() => setToolId(t.id)} className={`w-full text-left rounded-2xl p-4 border dark:border-slate-800 ${toolId === t.id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="font-black">{t.title}</div>
                <div className="text-xs mt-1 opacity-75">{t.prompt}</div>
              </button>
            ))}
          </aside>

          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-5">
            <div>
              <div className="text-sm font-black text-slate-500">Selected Tool</div>
              <h2 className="text-3xl font-black">{activeTool.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{activeTool.prompt}</p>
            </div>

            <div className="grid md:grid-cols-[1fr_220px] gap-3">
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter verse, chapter, character, topic, sermon theme, or lesson focus..." className="w-full min-h-36 rounded-2xl border dark:border-slate-700 bg-transparent p-4 outline-none" />
              <div className="space-y-3">
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none">
                  {['General', 'New Believers', 'Youth', 'Small Group', 'Church Workers', 'Pastors', 'Family'].map(a => <option key={a}>{a}</option>)}
                </select>
                <button onClick={generateLocalDraft} className="w-full rounded-2xl px-5 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">Generate Study Draft</button>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4">
              <h3 className="font-black text-xl">Starter Prompts</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {aiStudyPro.starterExamples.map(ex => <button key={ex} onClick={() => setInput(ex)} className="rounded-full px-3 py-2 bg-white dark:bg-slate-900 text-xs font-bold">{ex}</button>)}
              </div>
            </div>

            {latest && (
              <article className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-5 space-y-3">
                <div className="text-xs font-black text-slate-500">{latest.tool} • {latest.topic}</div>
                <pre className="whitespace-pre-wrap font-sans text-sm">{latest.content}</pre>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copyDraft(latest)} className="rounded-full px-4 py-2 bg-white dark:bg-slate-900 text-sm font-bold">Copy</button>
                  <button onClick={() => saveDraft(latest)} className="rounded-full px-4 py-2 bg-white dark:bg-slate-900 text-sm font-bold">Save</button>
                </div>
              </article>
            )}
          </section>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-black text-2xl">Saved Studies</h3>
          {saved.length === 0 && <p className="text-sm text-slate-500">No saved studies yet.</p>}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {saved.map(item => (
              <article key={item.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <div className="text-xs font-black text-slate-500">{item.tool}</div>
                <h4 className="font-black">{item.topic}</h4>
                <button onClick={() => copyDraft(item)} className="mt-3 rounded-full px-3 py-2 bg-white dark:bg-slate-900 text-xs font-bold">Copy</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}


function BibleMapsTimelinePage() {
  const [tab, setTab] = React.useState('Maps');
  const [query, setQuery] = React.useState('');
  const [done, setDone] = useLocal('s4es-v87-completed', []);
  const mark = id => setDone(done.includes(id) ? done.filter(x => x !== id) : [...done, id]);
  const all = [
    ...bibleMapsTimeline.maps.map(x => ({...x,type:'Map',name:x.title})),
    ...bibleMapsTimeline.timeline.map(x => ({...x,type:'Timeline',name:x.era})),
    ...bibleMapsTimeline.characters.map(x => ({...x,type:'Character',name:x.name})),
    ...bibleMapsTimeline.places.map(x => ({...x,type:'Place',name:x.name})),
    ...bibleMapsTimeline.events.map(x => ({...x,type:'Event',name:x.title}))
  ];
  const filtered = all.filter(x => `${x.type} ${x.name} ${x.summary||''} ${x.importance||''} ${x.references?.join(' ')||''}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell><main className="p-4 md:p-8 space-y-6">
      <PageTitle title="Bible Maps, Timeline & Visual Study Center" sub="V9.0 • Bible maps, timeline, character explorer, places, events, atlas references, and study challenges." />
      <section className="grid md:grid-cols-4 gap-4">
        <Stat to="/maps" icon={<MapPinned />} value={bibleMapsTimeline.maps.length} label="Bible maps" />
        <Stat to="/maps" icon={<Clock3 />} value={bibleMapsTimeline.timeline.length} label="Timeline eras" />
        <Stat to="/maps" icon={<UsersRound />} value={bibleMapsTimeline.characters.length} label="Characters" />
        <Stat to="/maps" icon={<Trophy />} value={done.length} label="Completed" />
      </section>
      <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm"><div className="flex flex-wrap gap-2">{['Maps','Timeline','Characters','Places','Events','Search'].map(t=><button key={t} onClick={()=>setTab(t)} className={`rounded-full px-4 py-2 text-sm font-black ${tab===t?'bg-slate-950 text-white dark:bg-white dark:text-slate-950':'bg-slate-100 dark:bg-slate-800'}`}>{t}</button>)}</div></section>
      {tab==='Maps'&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bibleMapsTimeline.maps.map(m=><article key={m.id} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><div className="text-xs font-black text-slate-500">{m.section}</div><h3 className="text-2xl font-black">{m.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{m.summary}</p><div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Journey Route</div><div className="font-bold mt-2">{m.route.join(' → ')}</div></div><p className="text-sm font-bold">{m.references.join('; ')}</p><button onClick={()=>mark(`map-${m.id}`)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{done.includes(`map-${m.id}`)?'Completed ✓':'Mark Explored'}</button></article>)}</section>}
      {tab==='Timeline'&&<section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">{bibleMapsTimeline.timeline.map((t,i)=><div key={t.era} className="grid md:grid-cols-[160px_1fr_auto] gap-4 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="font-black">{i+1}. {t.period}</div><div><h3 className="font-black text-xl">{t.era}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{t.summary}</p><p className="text-sm font-bold mt-2">{t.references.join('; ')}</p></div><button onClick={()=>mark(`timeline-${t.era}`)} className="rounded-full px-3 py-2 bg-white dark:bg-slate-900 text-xs font-bold">{done.includes(`timeline-${t.era}`)?'Done ✓':'Done'}</button></div>)}</section>}
      {tab==='Characters'&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bibleMapsTimeline.characters.map(c=><article key={c.name} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="text-2xl font-black">{c.name}</h3><p className="font-bold">{c.role}</p><p className="text-sm"><b>Strengths:</b> {c.strengths}</p><p className="text-sm"><b>Weaknesses:</b> {c.weaknesses}</p><p className="text-sm"><b>Lesson:</b> {c.lessons}</p><p className="text-sm font-bold">{c.references.join('; ')}</p><button onClick={()=>mark(`char-${c.name}`)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{done.includes(`char-${c.name}`)?'Studied ✓':'Mark Studied'}</button></article>)}</section>}
      {tab==='Places'&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bibleMapsTimeline.places.map(p=><article key={p.name} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="text-2xl font-black">{p.name}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{p.importance}</p><p className="text-sm font-bold">{p.references.join('; ')}</p><button onClick={()=>mark(`place-${p.name}`)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{done.includes(`place-${p.name}`)?'Explored ✓':'Mark Explored'}</button></article>)}</section>}
      {tab==='Events'&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bibleMapsTimeline.events.map(e=><article key={e.title} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="text-2xl font-black">{e.title}</h3><p className="text-sm text-slate-600 dark:text-slate-300">{e.summary}</p><p className="text-sm font-bold">{e.references.join('; ')}</p><button onClick={()=>mark(`event-${e.title}`)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{done.includes(`event-${e.title}`)?'Completed ✓':'Mark Completed'}</button></article>)}</section>}
      {tab==='Search'&&<section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Moses, Jerusalem, Exodus, Paul..." className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none"/><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{filtered.slice(0,60).map((x,i)=><div key={`${x.type}-${x.name}-${i}`} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">{x.type}</div><h3 className="font-black">{x.name}</h3><p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{x.summary||x.importance||x.lessons}</p></div>)}</div></section>}
    </main></Shell>
  );
}


function AcademyPage() {
  const [schoolId, setSchoolId] = React.useState(academySchools[0]?.id || 'foundations');
  const [lessonId, setLessonId] = React.useState(academySchools[0]?.lessons?.[0]?.id || '');
  const [completed, setCompleted] = useLocal('s4es-v86-academy-completed', []);
  const [quizAnswers, setQuizAnswers] = useLocal('s4es-v86-academy-quiz', {});
  const school = academySchools.find(s => s.id === schoolId) || academySchools[0];
  const lesson = school.lessons.find(l => l.id === lessonId) || school.lessons[0];
  const totalLessons = academySchools.reduce((sum, s) => sum + s.lessons.length, 0);
  const xp = completed.length * 10 + Object.values(quizAnswers).filter(Boolean).length * 20;
  const certificates = academySchools.filter(s => s.lessons.every(l => completed.includes(l.id)));
  const rank = xp >= 1200 ? 'Christian Scholar' : xp >= 800 ? 'Kingdom Leader' : xp >= 500 ? 'Kingdom Worker' : xp >= 250 ? 'Bible Student' : xp >= 100 ? 'Faith Builder' : 'Disciple';

  const markLesson = () => {
    setCompleted(completed.includes(lesson.id) ? completed.filter(x => x !== lesson.id) : [...completed, lesson.id]);
  };

  const answerQuiz = (option) => {
    setQuizAnswers({ ...quizAnswers, [lesson.id]: option === lesson.quiz.answer });
  };

  const downloadCertificate = (school) => {
    const text = `${school.certificate}\nCompleted Lessons: ${school.lessons.length}/${school.lessons.length}\nScriptures for Every Situation Academy`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${school.id}-certificate.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Christian Growth Academy" sub="V9.0 • Foundations, Prayer, Evangelism, Discipleship, and Leadership schools with lessons, quizzes, XP, certificates, and progress tracking." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/academy" icon={<GraduationCap />} value={academySchools.length} label="Schools" />
          <Stat to="/academy" icon={<BookOpenCheck />} value={`${completed.length}/${totalLessons}`} label="Lessons done" />
          <Stat to="/academy" icon={<Award />} value={xp} label="Academy XP" />
          <Stat to="/academy" icon={<CheckCircle2 />} value={certificates.length} label="Certificates" />
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <div className="text-xs font-black text-slate-500">Academy Rank</div>
          <div className="text-3xl font-black mt-1">{rank}</div>
        </section>

        <section className="grid lg:grid-cols-[340px_1fr] gap-5">
          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h3 className="font-black text-xl">Schools</h3>
            {academySchools.map(s => (
              <button key={s.id} onClick={() => { setSchoolId(s.id); setLessonId(s.lessons[0].id); }} className={`w-full text-left rounded-2xl p-4 border dark:border-slate-800 ${schoolId === s.id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="font-black">{s.title}</div>
                <div className="text-xs mt-1 opacity-75">{s.lessons.filter(l => completed.includes(l.id)).length}/{s.lessons.length} completed</div>
              </button>
            ))}
          </aside>

          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-5">
            <div>
              <div className="text-sm font-black text-slate-500">{school.title}</div>
              <h2 className="text-3xl font-black">{lesson.lessonNumber}. {lesson.title}</h2>
              <p className="font-bold mt-2">{lesson.scripture}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-3">{lesson.teaching}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {school.lessons.map(l => (
                <button key={l.id} onClick={() => setLessonId(l.id)} className={`text-left rounded-2xl p-3 border dark:border-slate-800 ${lesson.id === l.id ? 'bg-blue-50 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <div className="text-xs font-black text-slate-500">Lesson {l.lessonNumber}</div>
                  <div className="font-bold">{completed.includes(l.id) ? '✓ ' : ''}{l.title}</div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <h3 className="font-black text-xl">Reflection</h3>
              <ol className="list-decimal ml-5 mt-3 space-y-2">{lesson.reflectionQuestions.map((q,i)=><li key={i}>{q}</li>)}</ol>
            </div>

            <div className="rounded-2xl bg-amber-50 dark:bg-slate-800 p-4 space-y-3">
              <h3 className="font-black text-xl">Lesson Quiz</h3>
              <p className="font-bold">{lesson.quiz.question}</p>
              <div className="grid md:grid-cols-2 gap-2">
                {lesson.quiz.options.map(opt => {
                  const answered = quizAnswers[lesson.id] !== undefined;
                  const right = opt === lesson.quiz.answer;
                  return <button key={opt} onClick={() => answerQuiz(opt)} className={`text-left rounded-xl px-3 py-2 border dark:border-slate-700 ${answered && right ? 'bg-green-100 dark:bg-green-950/40' : 'bg-white dark:bg-slate-900'}`}>{opt}</button>
                })}
              </div>
              {quizAnswers[lesson.id] !== undefined && <p className="text-sm font-bold">{quizAnswers[lesson.id] ? 'Correct ✓ +20 XP' : 'Review and try the lesson again.'}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={markLesson} className="rounded-full px-5 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">{completed.includes(lesson.id) ? 'Completed ✓' : 'Mark Lesson Complete'}</button>
            </div>

            <div className="rounded-2xl bg-green-50 dark:bg-slate-800 p-4">
              <h3 className="font-black text-xl">Certificates</h3>
              {certificates.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Complete a full school to unlock certificates.</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {certificates.map(s => <button key={s.id} onClick={() => downloadCertificate(s)} className="rounded-full px-4 py-2 bg-white dark:bg-slate-900 text-sm font-black">{s.certificate}</button>)}
              </div>
            </div>
          </section>
        </section>
      </main>
    </Shell>
  );
}


function Devotions360Page() {
  const [day, setDay] = useLocal('s4es-v85-current-day', 1);
  const [completed, setCompleted] = useLocal('s4es-v85-completed', []);
  const [favorites, setFavorites] = useLocal('s4es-v85-favorites', []);
  const [journal, setJournal] = useLocal('s4es-v85-journal', {});
  const [query, setQuery] = React.useState('');
  const [notifyTime, setNotifyTime] = useLocal('s4es-v85-notify-time', '07:00');
  const [notifyOn, setNotifyOn] = useLocal('s4es-v85-notify-on', false);
  const active = devotions360.find(d => d.day === day) || devotions360[0];
  const filtered = devotions360.filter(d => (`${d.day} ${d.title} ${d.theme} ${d.story} ${d.bibleReading}`).toLowerCase().includes(query.toLowerCase())).slice(0, 80);
  const percent = Math.round((completed.length / devotions360.length) * 100);
  const favoriteItems = devotions360.filter(d => favorites.includes(d.day));
  React.useEffect(() => {
    if (!notifyOn) return;
    const timer = setInterval(() => {
      const now = new Date(); const hh = String(now.getHours()).padStart(2,'0'); const mm = String(now.getMinutes()).padStart(2,'0');
      const stamp = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${notifyTime}`;
      if (`${hh}:${mm}` === notifyTime && localStorage.getItem('s4es-v85-last-notified') !== stamp && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`Today's Devotion: Day ${active.day}`, { body: active.title, icon: '/icon-192.png' });
        localStorage.setItem('s4es-v85-last-notified', stamp);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [notifyOn, notifyTime, active.day, active.title]);
  const enableNotifications = async () => {
    if (!('Notification' in window)) return alert('Notifications are not supported.');
    const result = await Notification.requestPermission();
    if (result === 'granted') { setNotifyOn(true); new Notification('Daily devotion reminders enabled', { body: active.title, icon: '/icon-192.png' });}
  };
  const speak = () => { if (!window.speechSynthesis) return; window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Day ${active.day}. ${active.title}. Bible Reading: ${active.bibleReading}. ${active.story}. ${active.prayer}`)); };
  const stopSpeak = () => window.speechSynthesis?.cancel();
  const toggleComplete = () => setCompleted(completed.includes(active.day) ? completed.filter(x => x !== active.day) : [...completed, active.day]);
  const toggleFavorite = () => setFavorites(favorites.includes(active.day) ? favorites.filter(x => x !== active.day) : [...favorites, active.day]);
  const downloadCertificate = () => { const blob = new Blob([`360-Day Spiritual Growth Journey\nCompleted: ${completed.length}/${devotions360.length}\nProgress: ${percent}%`], {type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='360-day-devotion-certificate.txt'; a.click(); URL.revokeObjectURL(url); };
  return (
    <Shell><main className="p-4 md:p-8 space-y-6">
      <PageTitle title="360-Day Spiritual Growth Journey" sub="V9.0 • Full devotional overhaul with Bible reading, reflection, prayer, journal, favorites, search, audio, reminders, and certificate." />
      <section className="grid md:grid-cols-4 gap-4">
        <Stat to="/devotions" icon={<CalendarDays />} value={`${completed.length}/${devotions360.length}`} label="Completed" />
        <Stat to="/devotions" icon={<BarChart3 />} value={`${percent}%`} label="Progress" />
        <Stat to="/devotions" icon={<Star />} value={favorites.length} label="Favorites" />
        <Stat to="/devotions" icon={<PenLine />} value={Object.keys(journal).length} label="Journal entries" />
      </section>
      <section className="grid lg:grid-cols-[1fr_360px] gap-5">
        <article className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-sm font-black text-slate-500">Day {active.day} • {active.date}</div><h2 className="text-3xl md:text-5xl font-black mt-1">{active.title}</h2><p className="text-sm mt-3 font-bold">{active.week}</p><p className="text-sm text-slate-600 dark:text-slate-300">{active.theme}</p></div><div className="flex flex-wrap gap-2"><button onClick={toggleComplete} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">{completed.includes(active.day)?'Completed ✓':'Mark Complete'}</button><button onClick={toggleFavorite} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{favorites.includes(active.day)?'Saved ★':'Favorite'}</button></div></div>
          <div className="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Bible Reading</div><div className="font-black mt-1">{active.bibleReading}</div><div className="text-sm mt-2">{active.keyVerse}</div></div>
          <div className="whitespace-pre-line text-slate-700 dark:text-slate-200">{active.story}</div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><h3 className="font-black text-xl">Reflection Questions</h3><ol className="list-decimal ml-5 mt-3 space-y-2">{active.reflectionQuestions.map((q,i)=><li key={i}>{q}</li>)}</ol></div>
          <div className="rounded-2xl bg-amber-50 dark:bg-slate-800 p-4"><h3 className="font-black text-xl">Closing Prayer</h3><p className="mt-2 whitespace-pre-line">{active.prayer}</p></div>
          <div className="rounded-2xl border dark:border-slate-800 p-4"><h3 className="font-black text-xl">Today's Action</h3><p className="text-sm mt-2">{active.actionStep}</p></div>
          <div className="rounded-2xl border dark:border-slate-800 p-4"><label className="font-black">Reflection Journal</label><textarea value={journal[active.day] || ''} onChange={e => setJournal({...journal,[active.day]:e.target.value})} placeholder="What is God saying to you today?" className="mt-3 w-full min-h-32 rounded-2xl border dark:border-slate-700 bg-transparent p-3 outline-none" /></div>
          <div className="flex flex-wrap gap-2"><button onClick={()=>setDay(Math.max(1,active.day-1))} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Previous</button><button onClick={()=>setDay(Math.min(devotions360.length,active.day+1))} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Next</button><button onClick={speak} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Listen</button><button onClick={stopSpeak} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Stop</button></div>
        </article>
        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="font-black text-xl">Daily Reminder</h3><input type="time" value={notifyTime} onChange={e=>setNotifyTime(e.target.value)} className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none"/><div className="flex gap-2"><button onClick={enableNotifications} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Enable</button><button onClick={()=>setNotifyOn(!notifyOn)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{notifyOn?'Turn Off':'Turn On'}</button></div></section>
          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="font-black text-xl">Search Devotions</h3><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search faith, prayer, healing..." className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none"/><div className="max-h-96 overflow-auto space-y-2">{(query?filtered:devotions360.slice(0,20)).map(d=><button key={d.day} onClick={()=>setDay(d.day)} className="w-full text-left rounded-2xl bg-slate-50 dark:bg-slate-800 p-3"><div className="text-xs font-black text-slate-500">Day {d.day}</div><div className="font-bold">{d.title}</div></button>)}</div></section>
          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="font-black text-xl">Favorites</h3>{favoriteItems.length===0&&<p className="text-sm text-slate-500">No favorite devotions yet.</p>}{favoriteItems.slice(0,10).map(d=><button key={d.day} onClick={()=>setDay(d.day)} className="w-full text-left rounded-2xl bg-slate-50 dark:bg-slate-800 p-3">Day {d.day}: {d.title}</button>)}</section>
          <section className="rounded-[2rem] bg-green-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3"><h3 className="font-black text-xl">Completion Certificate</h3><button onClick={downloadCertificate} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Download Certificate</button></section>
        </aside>
      </section>
    </main></Shell>
  );
}


function BibleQuizHubPage() {
  const [mode, setMode] = React.useState('Flashcards');
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [cardIndex, setCardIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const [stats, setStats] = useLocal('s4es-v84-quiz-stats', { xp: 0, attempted: 0, correct: 0, streak: 0, bestStreak: 0, mastered: [] });
  const flashList = quizFlashcards.filter(q => q.difficulty === difficulty);
  const mcqList = quizMcqBank.filter(q => q.difficulty === difficulty);
  const card = flashList[cardIndex % Math.max(1, flashList.length)];
  const xpValue = { Easy: 5, Medium: 10, Hard: 20, 'Very Hard': 40 }[difficulty] || 5;
  const badge = stats.xp >= 2000 ? 'Bible Champion' : stats.xp >= 1000 ? 'Bible Master' : stats.xp >= 500 ? 'Bible Teacher' : stats.xp >= 200 ? 'Bible Scholar' : 'Bible Student';
  const accuracy = stats.attempted ? Math.round((stats.correct / stats.attempted) * 100) : 0;
  const nextCard = () => { setShowAnswer(false); setCardIndex((cardIndex + 1) % Math.max(1, flashList.length)); };
  const shuffleCards = () => { setShowAnswer(false); setCardIndex(Math.floor(Math.random() * Math.max(1, flashList.length))); };
  const markMastered = () => {
    if (!card) return;
    const exists = stats.mastered.includes(card.id);
    setStats({ ...stats, mastered: exists ? stats.mastered.filter(id => id !== card.id) : [...stats.mastered, card.id], xp: exists ? stats.xp : stats.xp + xpValue });
  };
  const answerMcq = (q, option) => {
    if (selected[q.id]) return;
    const correct = option.text === q.answer;
    const newStreak = correct ? stats.streak + 1 : 0;
    setSelected({ ...selected, [q.id]: option.text });
    setStats({ ...stats, attempted: stats.attempted + 1, correct: stats.correct + (correct ? 1 : 0), streak: newStreak, bestStreak: Math.max(stats.bestStreak, newStreak), xp: stats.xp + (correct ? xpValue : 0) });
  };
  return (
    <Shell><main className="p-4 md:p-8 space-y-6">
      <PageTitle title="Bible Quiz Flashcards & MCQs" sub="V9.0 • Full replacement using uploaded Flashcard and MCQ banks with Easy, Medium, Hard, and Very Hard stages." />
      <section className="grid md:grid-cols-4 gap-4">
        <Stat to="/memory" icon={<CreditCard />} value={quizFlashcards.length} label="Flashcards" />
        <Stat to="/memory" icon={<GraduationCap />} value={quizMcqBank.length} label="MCQs" />
        <Stat to="/memory" icon={<Award />} value={stats.xp} label="Quiz XP" />
        <Stat to="/memory" icon={<BarChart3 />} value={`${accuracy}%`} label="Accuracy" />
      </section>
      <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">{['Flashcards','MCQ Exam'].map(m => <button key={m} onClick={() => setMode(m)} className={`rounded-full px-4 py-2 text-sm font-black ${mode===m?'bg-slate-950 text-white dark:bg-white dark:text-slate-950':'bg-slate-100 dark:bg-slate-800'}`}>{m}</button>)}</div>
          <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setCardIndex(0); setShowAnswer(false); setSelected({}); }} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">{['Easy','Medium','Hard','Very Hard'].map(d => <option key={d}>{d}</option>)}</select>
        </div>
        <div className="grid md:grid-cols-5 gap-3">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Badge</div><div className="font-black">{badge}</div></div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Attempted</div><div className="font-black">{stats.attempted}</div></div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Correct</div><div className="font-black">{stats.correct}</div></div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Streak</div><div className="font-black">{stats.streak}</div></div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"><div className="text-xs font-black text-slate-500">Best</div><div className="font-black">{stats.bestStreak}</div></div>
        </div>
      </section>
      {mode === 'Flashcards' ? (
        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-sm font-black text-slate-500">{difficulty} Flashcard {flashList.length ? (cardIndex % flashList.length)+1 : 0}/{flashList.length}</div><h2 className="text-3xl font-black mt-1">Quiz Flashcard</h2></div><div className="flex flex-wrap gap-2"><button onClick={shuffleCards} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Shuffle</button><button onClick={nextCard} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Next</button></div></div>
          {card && <div className="rounded-[2rem] bg-slate-50 dark:bg-slate-800 p-6 min-h-72 flex flex-col justify-center text-center space-y-5"><div className="text-xs font-black text-slate-500">{card.difficulty}</div><h3 className="text-2xl md:text-4xl font-black">{card.question}</h3>{showAnswer ? <div className="rounded-2xl bg-white dark:bg-slate-900 p-5"><div className="text-xs font-black text-slate-500">Answer</div><div className="text-2xl font-black mt-1">{card.answer}</div></div> : <button onClick={() => setShowAnswer(true)} className="mx-auto rounded-full px-6 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">Reveal Answer</button>}<button onClick={markMastered} className="mx-auto rounded-full px-5 py-2 bg-green-100 dark:bg-green-950/40 text-sm font-black">{stats.mastered.includes(card.id) ? 'Mastered ✓' : `Mark Mastered (+${xpValue} XP)`}</button></div>}
        </section>
      ) : (
        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black text-2xl">{difficulty} MCQ Exam</h3><button onClick={() => setSelected({})} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Reset Round</button></div>
          <div className="grid lg:grid-cols-2 gap-4">{mcqList.map(q => <article key={q.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-3"><div className="text-xs font-black text-slate-500">{q.difficulty}</div><h4 className="font-black">{q.question}</h4><div className="grid gap-2">{q.options.map(opt => { const picked=selected[q.id]===opt.text; const show=selected[q.id]; const right=opt.text===q.answer; return <button key={opt.label} onClick={() => answerMcq(q,opt)} className={`text-left rounded-xl px-3 py-2 border dark:border-slate-700 ${show&&right?'bg-green-100 dark:bg-green-950/40':picked&&!right?'bg-red-100 dark:bg-red-950/40':'bg-white dark:bg-slate-900'}`}><b>{opt.label})</b> {opt.text}</button>; })}</div>{selected[q.id] && <p className="text-sm text-slate-600 dark:text-slate-300">{selected[q.id]===q.answer ? 'Correct ✓ ' : `Incorrect. Correct answer: ${q.answer}. `}{q.explanation}</p>}</article>)}</div>
        </section>
      )}
    </main></Shell>
  );
}


function MemoryQuizPageV83() {
  const [memoryDone, setMemoryDone] = useLocal('s4es-memory-done', []);
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [book, setBook] = React.useState('All');
  const [selected, setSelected] = React.useState({});
  const [notifyTime, setNotifyTime] = useLocal('s4es-memory-notify-time', '07:00');
  const [notifyEnabled, setNotifyEnabled] = useLocal('s4es-memory-notify-enabled', false);

  const todayIndex = Math.floor((Date.now() / 86400000)) % memoryVerses.length;
  const today = memoryVerses[todayIndex];
  const books = ['All', ...Array.from(new Set(memoryVerses.slice(0, 66).map(v => v.book)))];
  const filteredQuiz = bibleQuizzes.filter(q => (book === 'All' || q.book === book) && q.difficulty === difficulty).slice(0, 30);
  const score = filteredQuiz.filter(q => selected[q.id] === q.answer).length;

  React.useEffect(() => {
    if (!notifyEnabled) return;
    const timer = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const stamp = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${notifyTime}`;
      const last = localStorage.getItem('s4es-memory-last-notified');
      if (`${hh}:${mm}` === notifyTime && last !== stamp && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(today.notificationTitle, { body: today.notificationBody, icon: '/icon-192.png' });
        localStorage.setItem('s4es-memory-last-notified', stamp);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [notifyEnabled, notifyTime, today.notificationTitle, today.notificationBody]);

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported on this device.');
      return;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      setNotifyEnabled(true);
      new Notification('Bible Memory Verse Notifications Enabled', { body: today.notificationBody, icon: '/icon-192.png' });
    } else {
      alert('Notifications were not enabled. Check your browser settings.');
    }
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(today.notificationTitle, { body: today.notificationBody, icon: '/icon-192.png' });
    } else {
      alert('Please enable notifications first.');
    }
  };

  const markMemory = (day) => setMemoryDone(memoryDone.includes(day) ? memoryDone.filter(x => x !== day) : [...memoryDone, day]);
  const choose = (id, option) => setSelected({ ...selected, [id]: option });
  const copyVerse = async (v) => await navigator.clipboard?.writeText(`${v.reference}\n${v.verse}`);
  const speakVerse = (v) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${v.reference}. ${v.verse}`));
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Bible Memory Verses & Advanced Quizzes" sub="V9.0 • Daily memory verses from all 66 books, browser reminders, and expanded Bible quiz stages: Easy, Medium, Hard, and Very Hard." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/memory" icon={<Brain />} value="365" label="Daily memory verses" />
          <Stat to="/memory" icon={<BookOpen />} value="66" label="Bible books covered" />
          <Stat to="/memory" icon={<GraduationCap />} value={difficulty} label="Quiz stage" />
          <Stat to="/memory" icon={<Trophy />} value={`${score}/${filteredQuiz.length}`} label="Current score" />
        </section>

        <section className="grid lg:grid-cols-[1fr_360px] gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="text-sm font-black text-slate-500">Today's Memory Verse • Day {today.day}</div>
            <h2 className="text-3xl font-black">{today.book}</h2>
            <p className="font-black mt-2">{today.reference}</p>
            <p className="text-lg mt-3">{today.verse}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{today.application || today.theme}</p>
            <div className="grid md:grid-cols-4 gap-2">
              {(today.practice || []).map(p => <div key={p} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm">{p}</div>)}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => markMemory(today.day)} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">{memoryDone.includes(today.day) ? 'Memorized ✓' : 'Mark Memorized'}</button>
              <button onClick={() => copyVerse(today)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Copy</button>
              <button onClick={() => speakVerse(today)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Audio</button>
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl flex items-center gap-2"><Bell size={22}/> Daily Screen Notification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Set a daily browser reminder for the memory verse. Works when browser notifications are allowed and the app has been opened recently.</p>
            <label className="text-sm font-black">Reminder Time</label>
            <input type="time" value={notifyTime} onChange={e => setNotifyTime(e.target.value)} className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none" />
            <div className="flex flex-wrap gap-2">
              <button onClick={requestNotifications} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Enable</button>
              <button onClick={testNotification} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Test</button>
              <button onClick={() => setNotifyEnabled(!notifyEnabled)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">{notifyEnabled ? 'Turn Off' : 'Turn On'}</button>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm">Status: {notifyEnabled ? 'Enabled' : 'Off'} • Time: {notifyTime}</div>
          </aside>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-black text-2xl">Advanced Bible Quiz Mode</h3>
            <div className="flex flex-wrap gap-2">
              <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setSelected({}); }} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">
                {['Easy', 'Medium', 'Hard', 'Very Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
              <select value={book} onChange={e => { setBook(e.target.value); setSelected({}); }} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">
                {books.map(b => <option key={b}>{b}</option>)}
              </select>
              <button onClick={() => setSelected({})} className="rounded-2xl border dark:border-slate-700 px-4 py-2 font-bold">Reset</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {filteredQuiz.map(q => (
              <article key={q.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-3">
                <div className="text-xs font-black text-slate-500">{q.book} • {q.difficulty} • {q.category}</div>
                <h4 className="font-black">{q.question}</h4>
                <div className="grid gap-2">
                  {q.options.map(opt => {
                    const picked = selected[q.id] === opt;
                    const right = opt === q.answer;
                    const show = selected[q.id];
                    return (
                      <button key={opt} onClick={() => choose(q.id, opt)} className={`text-left rounded-xl px-3 py-2 border dark:border-slate-700 ${show && right ? 'bg-green-100 dark:bg-green-950/40' : picked && !right ? 'bg-red-100 dark:bg-red-950/40' : 'bg-white dark:bg-slate-900'}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selected[q.id] && <p className="text-sm text-slate-600 dark:text-slate-300">{selected[q.id] === q.answer ? 'Correct ✓ ' : 'Not quite. '} {q.explanation}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-black text-2xl">All 66 Books Memory Verse Index</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {memoryVerses.slice(0, 66).map(v => (
              <div key={v.book} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <div className="font-black">{v.book}</div>
                <div className="text-sm font-bold">{v.reference}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{v.verse}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}


function MemoryQuizPage() {
  const [memoryDone, setMemoryDone] = useLocal('s4es-memory-done', []);
  const [difficulty, setDifficulty] = React.useState('Easy');
  const [book, setBook] = React.useState('All');
  const [selected, setSelected] = React.useState({});
  const todayIndex = Math.floor((Date.now() / 86400000)) % memoryVerses.length;
  const today = memoryVerses[todayIndex];
  const books = ['All', ...Array.from(new Set(memoryVerses.map(v => v.book)))];
  const filteredQuiz = bibleQuizzes.filter(q => (book === 'All' || q.book === book) && q.difficulty === difficulty).slice(0, 20);

  const markMemory = (day) => {
    setMemoryDone(memoryDone.includes(day) ? memoryDone.filter(x => x !== day) : [...memoryDone, day]);
  };

  const choose = (id, option) => setSelected({ ...selected, [id]: option });

  const score = filteredQuiz.filter(q => selected[q.id] === q.answer).length;

  const copyVerse = async (v) => {
    await navigator.clipboard?.writeText(`${v.reference}\n${v.verse}`);
  };

  const speakVerse = (v) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${v.reference}. ${v.verse}`));
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Bible Memory Verses & Quizzes" sub="V9.0 • Daily memory verses from all 66 books and Bible quizzes in Easy, Medium, Hard, and Very Hard stages." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/memory" icon={<Brain />} value="365" label="Daily memory verses" />
          <Stat to="/memory" icon={<BookOpen />} value="66" label="Bible books covered" />
          <Stat to="/memory" icon={<GraduationCap />} value={difficulty} label="Quiz stage" />
          <Stat to="/memory" icon={<Trophy />} value={`${score}/${filteredQuiz.length}`} label="Current score" />
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-black text-slate-500">Today's Memory Verse • Day {today.day}</div>
              <h2 className="text-3xl font-black">{today.book}</h2>
              <p className="font-black mt-2">{today.reference}</p>
              <p className="text-lg mt-3">{today.verse}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{today.prompt}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => markMemory(today.day)} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">{memoryDone.includes(today.day) ? 'Memorized ✓' : 'Mark Memorized'}</button>
              <button onClick={() => copyVerse(today)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Copy</button>
              <button onClick={() => speakVerse(today)} className="rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-sm font-bold">Audio</button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-black text-2xl">Bible Quiz Mode</h3>
            <div className="flex flex-wrap gap-2">
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">
                {['Easy', 'Medium', 'Hard', 'Very Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
              <select value={book} onChange={e => setBook(e.target.value)} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">
                {books.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {filteredQuiz.map(q => (
              <article key={q.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-3">
                <div className="text-xs font-black text-slate-500">{q.book} • {q.difficulty}</div>
                <h4 className="font-black">{q.question}</h4>
                <div className="grid gap-2">
                  {q.options.map(opt => {
                    const picked = selected[q.id] === opt;
                    const right = opt === q.answer;
                    const show = selected[q.id];
                    return (
                      <button key={opt} onClick={() => choose(q.id, opt)} className={`text-left rounded-xl px-3 py-2 border dark:border-slate-700 ${show && right ? 'bg-green-100 dark:bg-green-950/40' : picked && !right ? 'bg-red-100 dark:bg-red-950/40' : 'bg-white dark:bg-slate-900'}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selected[q.id] && <p className="text-sm text-slate-600 dark:text-slate-300">{selected[q.id] === q.answer ? 'Correct ✓ ' : 'Not quite. '} {q.explanation}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="font-black text-2xl">All 66 Books Memory Verse Index</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {memoryVerses.slice(0, 66).map(v => (
              <div key={v.book} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                <div className="font-black">{v.book}</div>
                <div className="text-sm font-bold">{v.reference}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{v.verse}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}


function BrandingStabilityPage() {
  const checks = [
    'Groups page crash fixed',
    'Heart icon import stabilized',
    'Favicon configured',
    'PWA app icons configured',
    'Manifest updated',
    'Splash screen branding configured',
    'Logo assets added',
    'Production stability checklist added'
  ];
  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Production Branding & Stability" sub="V9.0 • Logo, favicon, app icons, splash screen, manifest cleanup, and critical page crash fix." />
        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/branding" icon={<Palette />} value="Brand" label="Identity ready" />
          <Stat to="/branding" icon={<Image />} value="Icons" label="PWA assets" />
          <Stat to="/groups" icon={<Bug />} value="Fixed" label="Groups route" />
          <Stat to="/branding" icon={<ShieldCheck />} value="Stable" label="Launch polish" />
        </section>
        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-2xl">V9.0 Stability Checklist</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {checks.map(item => (
              <div key={item} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 font-bold">✓ {item}</div>
            ))}
          </div>
        </section>
        <section className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-black text-2xl">Branding Assets</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Added favicon, SVG logo, 192px and 512px app icons, updated manifest, and launch screen colors for mobile installation.</p>
        </section>
      </main>
    </Shell>
  );
}


function FinalReleasePage() {
  const checks = [
    'Supabase production variables configured',
    'OpenAI API key configured',
    'Authentication tested',
    'Cloud sync tested',
    'PWA install tested',
    'Privacy and Terms reviewed',
    'Bible, devotions, journal, study, sermons, family, collections, missions, and community routes tested',
    'Final Vercel deployment verified'
  ];
  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Final Production Release" sub="V9.0 • Launch-ready Christian Bible, devotion, prayer, study, sermon, family, missions, and community platform." />
        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-2xl">V9.0 Launch Checklist</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {checks.map(item => (
              <div key={item} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 font-bold">✓ {item}</div>
            ))}
          </div>
        </section>
        <section className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-black text-2xl">What is complete</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Bible reader, 365 devotions, 1000+ devotion library, AI guidance, sermon builder, study companion, prayer journal, family devotions, seasonal devotions, special collections, church group tools, community prayer and testimony, missions mode, mobile readiness, and production launch pages.</p>
        </section>
      </main>
    </Shell>
  );
}


function MobileLaunchPage() {
  const [checks, setChecks] = useLocal('s4es-mobile-launch-checks', []);
  const items = [
    'PWA install tested on Android Chrome',
    'Add to Home Screen tested on iPhone Safari',
    'App icon and splash screen reviewed',
    'Offline fallback tested',
    'Auth, AI, Bible, Devotions, Journal, and Sync tested',
    'Privacy, Terms, Contact, and Feedback pages reviewed',
    'Google Play Store listing text drafted',
    'Apple App Store listing text drafted'
  ];

  const toggle = (item) => setChecks(checks.includes(item) ? checks.filter(x => x !== item) : [...checks, item]);
  const progress = Math.round((checks.length / items.length) * 100);

  const copyStoreText = async () => {
    const text = `Scriptures for Every Situation\n\nA Christian Bible, devotion, prayer, study, sermon, and spiritual growth app with topical Scriptures, daily devotions, prayer journal, Bible study tools, sermon builder, family devotions, missions tools, and AI-guided Scripture support.`;
    await navigator.clipboard?.writeText(text);
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Mobile & App Store Readiness" sub="V9.0 • Final mobile-readiness checklist for PWA, Android, iPhone, app store preparation, and launch review." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/mobile" icon={<Smartphone />} value="PWA" label="Install ready" />
          <Stat to="/mobile" icon={<Store />} value="Store" label="Listing prep" />
          <Stat to="/mobile" icon={<BadgeCheck />} value={`${progress}%`} label="Checklist done" />
          <Stat to="/launch" icon={<Rocket />} value="V8" label="Next release" />
        </section>

        <section className="grid lg:grid-cols-[1fr_380px] gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Launch Readiness Checklist</h3>
            {items.map(item => (
              <button key={item} onClick={() => toggle(item)} className={`w-full text-left rounded-2xl border dark:border-slate-800 p-4 ${checks.includes(item) ? 'bg-green-50 dark:bg-green-950/30' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="font-bold">{checks.includes(item) ? '✓ ' : ''}{item}</div>
              </button>
            ))}
          </div>

          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Install Instructions</h3>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <h4 className="font-black">Android</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">Open in Chrome → tap menu → Install App or Add to Home screen.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <h4 className="font-black">iPhone</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">Open in Safari → Share → Add to Home Screen.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <h4 className="font-black">Store Submission</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">Use Capacitor later to wrap the same web app for Google Play and Apple App Store.</p>
            </div>
            <button onClick={copyStoreText} className="rounded-full px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-black">Copy Store Description</button>
          </aside>
        </section>

        <section className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-black text-xl">Final V9.0 Target</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">After this checklist is complete, V9.0 should be the final production release: bug fixes, final metadata, SEO, app icons, analytics confirmation, store-readiness, and public launch messaging.</p>
        </section>
      </main>
    </Shell>
  );
}


function MissionsPage() {
  const [completed, setCompleted] = useLocal('s4es-missions-completed', []);
  const [notes, setNotes] = useLocal('s4es-missions-notes', '');
  const [selectedPlan, setSelectedPlan] = React.useState('seven');

  const plan = selectedPlan === 'seven'
    ? missionsData.sevenDayPlan
    : Array.from({ length: 30 }, (_, i) => missionsData.thirtyDayChallenge[i % missionsData.thirtyDayChallenge.length]);

  const toggle = (id) => setCompleted(completed.includes(id) ? completed.filter(x => x !== id) : [...completed, id]);

  const copyGospelGuide = async () => {
    const text = `${missionsData.gospelGuide.title}\n\n${missionsData.gospelGuide.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nPrayer: ${missionsData.gospelGuide.closingPrayer}`;
    await navigator.clipboard?.writeText(text);
  };

  const speakGospelGuide = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${missionsData.gospelGuide.title}. ${missionsData.gospelGuide.steps.join('. ')}. ${missionsData.gospelGuide.closingPrayer}`));
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Missions & Evangelism Mode" sub="V9.0 • Outreach plans, salvation scriptures, gospel presentation guide, missionary prayer calendar, and witnessing conversation starters." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/missions" icon={<Globe2 />} value="7/30" label="Outreach plans" />
          <Stat to="/missions" icon={<BookMarked />} value={missionsData.salvationScriptures.length} label="Salvation verses" />
          <Stat to="/missions" icon={<Send />} value={completed.length} label="Steps completed" />
          <Stat to="/missions" icon={<Map />} value="Mission" label="Prayer calendar" />
        </section>

        <section className="grid lg:grid-cols-[1fr_380px] gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-black text-2xl">Outreach Plan</h3>
              <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-2 outline-none">
                <option value="seven">7-Day Outreach Plan</option>
                <option value="thirty">30-Day Evangelism Challenge</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {plan.map((step, i) => {
                const id = `${selectedPlan}-${i}`;
                return (
                  <button key={id} onClick={() => toggle(id)} className={`text-left rounded-2xl border dark:border-slate-800 p-4 ${completed.includes(id) ? 'bg-green-50 dark:bg-green-950/30' : 'bg-slate-50 dark:bg-slate-800'}`}>
                    <div className="text-xs font-black text-slate-500">Day {i + 1}</div>
                    <div className="font-bold">{step}</div>
                    <div className="text-xs mt-2">{completed.includes(id) ? 'Completed ✓' : 'Tap to mark complete'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Gospel Guide</h3>
            <ol className="list-decimal ml-5 space-y-2 text-sm">
              {missionsData.gospelGuide.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 text-sm">
              <b>Prayer:</b> {missionsData.gospelGuide.closingPrayer}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={copyGospelGuide} className="rounded-full px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800">Copy</button>
              <button onClick={speakGospelGuide} className="rounded-full px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800">Audio</button>
            </div>
          </aside>
        </section>

        <section className="grid lg:grid-cols-3 gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-black text-xl">Salvation Scriptures</h3>
            {missionsData.salvationScriptures.map(v => (
              <div key={v.reference} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3">
                <div className="font-black">{v.reference}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{v.theme}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-black text-xl">Conversation Starters</h3>
            {missionsData.conversationStarters.map((s, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm">{s}</div>
            ))}
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-black text-xl">Missionary Prayer Calendar</h3>
            {missionsData.missionaryPrayerCalendar.map((s, i) => (
              <div key={i} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm"><b>Day {i + 1}:</b> {s}</div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-xl">Follow-Up Discipleship Plan</h3>
          <div className="grid md:grid-cols-5 gap-3">
            {missionsData.followUpPlan.map((s, i) => (
              <div key={i} className="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4 text-sm">
                <div className="text-xs font-black text-slate-500">Step {i + 1}</div>
                {s}
              </div>
            ))}
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Write names, prayer burdens, follow-up notes, and outreach ideas..." className="w-full min-h-28 rounded-2xl border dark:border-slate-700 bg-transparent p-3 outline-none" />
        </section>
      </main>
    </Shell>
  );
}


function CommunityPage() {
  const [requests, setRequests] = useLocal('s4es-community-prayers', []);
  const [testimonies, setTestimonies] = useLocal('s4es-community-testimonies', []);
  const [requestForm, setRequestForm] = React.useState({ title: '', category: 'Healing', details: '', anonymous: true });
  const [testimonyForm, setTestimonyForm] = React.useState({ title: '', reference: '', details: '' });

  const addRequest = () => {
    if (!requestForm.title.trim()) return;
    setRequests([{ id: Date.now(), ...requestForm, createdAt: new Date().toISOString(), prayed: false }, ...requests]);
    setRequestForm({ title: '', category: 'Healing', details: '', anonymous: true });
  };

  const addTestimony = () => {
    if (!testimonyForm.title.trim()) return;
    setTestimonies([{ id: Date.now(), ...testimonyForm, createdAt: new Date().toISOString() }, ...testimonies]);
    setTestimonyForm({ title: '', reference: '', details: '' });
  };

  const togglePrayed = (id) => setRequests(requests.map(r => r.id === id ? { ...r, prayed: !r.prayed } : r));

  const copyCommunitySummary = async () => {
    const text = `Community Prayer Summary\n\nPrayer Requests: ${requests.length}\nPrayed Over: ${requests.filter(r => r.prayed).length}\nTestimonies: ${testimonies.length}`;
    await navigator.clipboard?.writeText(text);
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Community Prayer & Testimony" sub="V9.0 • Prayer request wall, testimony wall, and safe sharing guidelines. Supabase community publishing can be connected later." />

        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/community" icon={<MessageCircle />} value={requests.length} label="Prayer requests" />
          <Stat to="/community" icon={<HeartHandshake />} value={requests.filter(r => r.prayed).length} label="Prayed over" />
          <Stat to="/community" icon={<Megaphone />} value={testimonies.length} label="Testimonies" />
          <Stat to="/community" icon={<ShieldCheck />} value="Safe" label="Sharing mode" />
        </section>

        <section className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Add Prayer Request</h3>
            <input value={requestForm.title} onChange={e => setRequestForm({ ...requestForm, title: e.target.value })} placeholder="Prayer request title" className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none" />
            <select value={requestForm.category} onChange={e => setRequestForm({ ...requestForm, category: e.target.value })} className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none">
              {['Healing', 'Family', 'Career', 'Provision', 'Peace', 'Salvation', 'Thanksgiving'].map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea value={requestForm.details} onChange={e => setRequestForm({ ...requestForm, details: e.target.value })} placeholder="Write details you are comfortable saving on this device..." className="w-full min-h-28 rounded-2xl border dark:border-slate-700 bg-transparent p-3 outline-none" />
            <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={requestForm.anonymous} onChange={e => setRequestForm({ ...requestForm, anonymous: e.target.checked })} /> Save as anonymous</label>
            <button onClick={addRequest} className="rounded-full px-5 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">Save Prayer Request</button>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-2xl">Add Testimony</h3>
            <input value={testimonyForm.title} onChange={e => setTestimonyForm({ ...testimonyForm, title: e.target.value })} placeholder="Testimony title" className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none" />
            <input value={testimonyForm.reference} onChange={e => setTestimonyForm({ ...testimonyForm, reference: e.target.value })} placeholder="Scripture reference, e.g. Psalm 34:4" className="w-full rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none" />
            <textarea value={testimonyForm.details} onChange={e => setTestimonyForm({ ...testimonyForm, details: e.target.value })} placeholder="How did God help, strengthen, provide, or answer?" className="w-full min-h-28 rounded-2xl border dark:border-slate-700 bg-transparent p-3 outline-none" />
            <button onClick={addTestimony} className="rounded-full px-5 py-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black">Save Testimony</button>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-xl">Prayer Requests</h3>
            {requests.length === 0 && <p className="text-sm text-slate-500">No prayer requests yet.</p>}
            {requests.map(r => (
              <article key={r.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2">
                <div className="text-xs font-black text-slate-500">{r.category} • {r.anonymous ? 'Anonymous' : 'Named'}</div>
                <h4 className="font-black">{r.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{r.details}</p>
                <button onClick={() => togglePrayed(r.id)} className="rounded-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900">{r.prayed ? 'Prayed over ✓' : 'Mark prayed'}</button>
              </article>
            ))}
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-xl">Testimony Wall</h3>
            {testimonies.length === 0 && <p className="text-sm text-slate-500">No testimonies yet.</p>}
            {testimonies.map(t => (
              <article key={t.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2">
                <div className="text-xs font-black text-slate-500">{t.reference || 'Thanksgiving'}</div>
                <h4 className="font-black">{t.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-blue-50 dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-xl">Safe Sharing Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {communityPrompts.map(p => (
              <div key={p.id} className="rounded-2xl bg-white dark:bg-slate-800 p-4">
                <h4 className="font-black">{p.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{p.description}</p>
                <ul className="text-xs mt-2 list-disc ml-4">{p.examples.map(e => <li key={e}>{e}</li>)}</ul>
              </div>
            ))}
          </div>
          <button onClick={copyCommunitySummary} className="rounded-full px-4 py-2 bg-white dark:bg-slate-800 text-sm font-bold">Copy Summary</button>
        </section>
      </main>
    </Shell>
  );
}


function GroupsPage() {
  const [active, setActive] = React.useState(groupPlans[0]?.id || '');
  const [notes, setNotes] = useLocal('s4es-group-leader-notes', '');
  const selected = groupPlans.find(p => p.id === active) || groupPlans[0];
  const guide = discussionGuides.find(g => g.title === selected?.title) || discussionGuides[0];

  const copyGuide = async () => {
    const text = `${guide.title}\n\nOpening Prayer: ${guide.openingPrayer}\n\nIcebreaker: ${guide.icebreaker}\n\nScripture: ${guide.scripture}\n\nDiscussion Questions:\n${guide.discussionQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nLeader Notes: ${guide.leaderNotes}\n\nAction Step: ${guide.actionStep}`;
    await navigator.clipboard?.writeText(text);
  };

  const speakGuide = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${guide.title}. ${guide.openingPrayer}. ${guide.scripture}. ${guide.actionStep}`));
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="Church & Small Group Mode" sub="V9.0 • Group devotion plans, leader guides, family altar rhythms, and church prayer resources." />
        <section className="grid md:grid-cols-4 gap-4">
          <Stat to="/groups" icon={<Users />} value={groupPlans.length} label="Group plans" />
          <Stat to="/groups" icon={<BookOpen />} value={discussionGuides.length} label="Leader guides" />
          <Stat to="/family" icon={<Heart />} value="Family" label="Altar mode" />
          <Stat to="/sermons" icon={<Sparkles />} value="Sermon" label="Builder ready" />
        </section>

        <section className="grid lg:grid-cols-[360px_1fr] gap-5">
          <aside className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h3 className="font-black text-lg">Group Plans</h3>
            {groupPlans.map(plan => (
              <button key={plan.id} onClick={() => setActive(plan.id)} className={`w-full text-left rounded-2xl border dark:border-slate-800 p-4 ${active === plan.id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="text-xs font-black opacity-70">{plan.audience}</div>
                <div className="font-black">{plan.title}</div>
                <div className="text-xs mt-1 opacity-80">{plan.reference}</div>
              </button>
            ))}
          </aside>

          <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-5">
            <div>
              <div className="text-sm font-black text-slate-500">{selected.audience}</div>
              <h2 className="text-3xl font-black">{selected.title}</h2>
              <p className="text-sm font-bold mt-2">{selected.reference}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-3">{selected.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {selected.sessions.map((s, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                  <div className="text-xs font-black text-slate-500">Session {i + 1}</div>
                  <div className="font-bold">{s}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] bg-blue-50 dark:bg-slate-800 p-5 space-y-3">
              <h3 className="font-black text-xl">Leader Discussion Guide</h3>
              <p><b>Opening Prayer:</b> {guide.openingPrayer}</p>
              <p><b>Icebreaker:</b> {guide.icebreaker}</p>
              <p><b>Scripture:</b> {guide.scripture}</p>
              <div>
                <b>Discussion Questions:</b>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  {guide.discussionQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </div>
              <p><b>Leader Notes:</b> {guide.leaderNotes}</p>
              <p><b>Action Step:</b> {guide.actionStep}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={copyGuide} className="rounded-full px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900">Copy Guide</button>
                <button onClick={speakGuide} className="rounded-full px-4 py-2 text-sm font-bold bg-white dark:bg-slate-900">Audio</button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border dark:border-slate-800 p-4">
              <label className="font-black">Leader Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Write group insights, attendance notes, prayer requests, and next steps..." className="mt-2 w-full min-h-32 rounded-2xl border dark:border-slate-700 bg-transparent p-3 outline-none" />
            </div>
          </section>
        </section>
      </main>
    </Shell>
  );
}


function DevotionalLibraryPage() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('All');
  const categories = ['All', ...Array.from(new Set(devotionalLibrary.map(d => d.category)))];
  const filtered = devotionalLibrary.filter(d => {
    const matchesCategory = category === 'All' || d.category === category;
    const text = `${d.title} ${d.category} ${d.reference} ${d.summary}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  });

  const copyDevotion = async (d) => {
    const text = `${d.title}\n${d.reference}\n\n${d.message}\n\nPrayer: ${d.prayer}\nDeclaration: ${d.declaration}\nAction: ${d.action}`;
    await navigator.clipboard?.writeText(text);
  };

  const speakDevotion = (d) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${d.title}. ${d.reference}. ${d.message}. ${d.prayer}`));
  };

  return (
    <Shell>
      <main className="p-4 md:p-8 space-y-6">
        <PageTitle title="1000+ Original Devotions Library" sub="V9.0 • Search and study expanded original devotional packs for faith, prayer, healing, family, leadership, finances, anxiety, hope, purpose, and spiritual warfare." />
        <section className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search devotions, categories, or references..." className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-2xl border dark:border-slate-700 bg-transparent px-4 py-3 outline-none">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat to="/library" icon={<BookOpen />} value={devotionalLibrary.length.toLocaleString()} label="Original devotions" />
            <Stat to="/library" icon={<Grid3X3 />} value={categories.length - 1} label="Category packs" />
            <Stat to="/devotions" icon={<Sunrise />} value="365" label="Daily plan" />
            <Stat to="/collections" icon={<Sparkles />} value="Special" label="Collections" />
          </div>
        </section>
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.slice(0, 120).map(d => (
            <article key={d.id} className="rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="text-xs font-black text-slate-500">{d.category} • Devotion {d.number}</div>
              <h3 className="text-xl font-black">{d.title}</h3>
              <p className="text-sm font-bold">{d.reference}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{d.summary}</p>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 text-sm">{d.message}</div>
              <p className="text-sm"><b>Prayer:</b> {d.prayer}</p>
              <p className="text-sm"><b>Declaration:</b> {d.declaration}</p>
              <p className="text-sm"><b>Action:</b> {d.action}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyDevotion(d)} className="rounded-full px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800">Copy</button>
                <button onClick={() => speakDevotion(d)} className="rounded-full px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800">Audio</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Shell>
  );
}


export default function App() {
  return <ThemeProvider><Routes><Route path="/" element={<HomePage />} /><Route path="/topics" element={<TopicsPage />} /><Route path="/topic/:id" element={<TopicPage />} /><Route path="/bible" element={<BiblePage />} /><Route path="/bible/:bookId/:chapter" element={<BibleChapterPage />} /><Route path="/family" element={<FamilyDevotionsPage />} /><Route path="/collections" element={<SpecialCollectionsPage />} /><Route path="/seasonal" element={<SeasonalDevotionsPage />} /><Route path="/devotions" element={<Devotions360Page />} />
      <Route path="/academy" element={<AcademyPage />} />
      <Route path="/maps" element={<BibleMapsTimelinePage />} />
      <Route path="/ai-pro" element={<AIStudyProPage />} />
      <Route path="/ministry" element={<ChurchMinistrySuitePage />} />
      <Route path="/store-release" element={<FinalStoreReleasePage />} /><Route path="/devotions/:day" element={<DevotionPage />} /><Route path="/habits" element={<HabitPage />} /><Route path="/progress" element={<ProgressPage />} /><Route path="/analytics" element={<AnalyticsPage />} /><Route path="/study" element={<StudyPage />} /><Route path="/companion" element={<BibleStudyCompanionPage />} /><Route path="/sermons" element={<SermonBuilderPage />} /><Route path="/favorites" element={<FavoritesPage />} /><Route path="/plans" element={<PlansPage />} /><Route path="/journal" element={<JournalPage />} /><Route path="/reminders" element={<RemindersPage />} /><Route path="/assistant" element={<AssistantPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="/onboarding" element={<OnboardingPage />} /><Route path="/help" element={<HelpPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="/quality" element={<ContentQualityPage />} /><Route path="/polish" element={<UIPolishPage />} /><Route path="/launch" element={<LaunchPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/privacy" element={<PrivacyPage />} /><Route path="/terms" element={<TermsPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/groups" element={<GroupsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/missions" element={<MissionsPage />} />
      <Route path="/mobile" element={<MobileLaunchPage />} />
      <Route path="/final-release" element={<FinalReleasePage />} />
      <Route path="/branding" element={<BrandingStabilityPage />} />
      <Route path="/memory" element={<BibleQuizHubPage />} />
      <Route path="*" element={<NotFound />} /></Routes></ThemeProvider>;
}
